import React, { useEffect, useState } from "react";
import "../login/style.scss";
import LogoForm from "@/pages/(auth)/components/LogoForm";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Input from "@/pages/(auth)/components/Input";
import { Eye, EyeOff } from "lucide-react";
import * as yup from "yup";
import { useResetPasswordMutation, useResetPasswordValidationMutation } from "@/state/slices/authApiSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Reset() {
  const [resetPassword, { isLoading, isSuccess, isError, error }] =
    useResetPasswordMutation();
  const [isValidToken, setIsValidToken] = useState(true)
  const [resetPasswordValidation] =
    useResetPasswordValidationMutation();

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const reset_token = searchParams.get("reset_token");

  const handleCheckValidToken = async () => {
    if (reset_token) {
      const { error }: any = await resetPasswordValidation({ reset_token })
      if (error?.data?.message) {
        alert('Password reset link has expired. Please request again.')
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    if (!reset_token) navigate("/forgot-password");
    if (reset_token) {
      handleCheckValidToken()
    }
  }, [reset_token]);

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        password: yup.string().required("required"),
        password_confirmation: yup
          .string()
          .oneOf([yup.ref("password"), ""], "Passwords must match")
          .required("required"),
      })
    ),
  });

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <>
      {
        !isValidToken ? <div>Token is Invalid...</div> :
          <LogoForm
            heading="Reset your password"
            subHeading="Strong passwords include numbers, letters, and punctuation marks."
            onSubmit={({ password, password_confirmation }) => {
              if (reset_token)
                resetPassword({
                  reset_token,
                  password,
                  password_confirmation,
                });
            }}
            submitText="Reset Password"
            methods={methods}
          >
            <div className="form-group mb-3">
              <Input
                type="passwordToggle"
                id="password"
                placeholder="Enter new password"
                validations={{}}
              />
            </div>

            <div className="form-group mb-3">
              <Input
                type="passwordToggle"
                id="password_confirmation"
                placeholder="Confirm new password"
                validations={{}}
              />
            </div>
          </LogoForm>
      }
    </>
  );
}
