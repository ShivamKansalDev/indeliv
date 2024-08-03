import "../login/style.scss";
import LogoForm from "@/pages/(auth)/components/LogoForm";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/state/slices/authApiSlice";
import Input from "@/pages/(auth)/components/Input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import { LoginUserContext } from "@/App";

export default function () {
  const context = useContext(LoginUserContext)
  const [forgotPassword, { data, isLoading, isSuccess, isError, error }]: any =
    useForgotPasswordMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      alert(`Password reset email has been sent to ${context?.emailOrPhone}`)
      navigate('/login')
    }
  }, [isSuccess]);

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email("Invalid email").required("required"),
      })
    ),
    defaultValues: {
      email: context?.emailOrPhone as any
    }
  });

  useEffect(() => {
    if (isError) {
      methods.setError("email", {
        type: "custom",
        message: "Email is incorrect",
      });
    }
  }, [isError]);

  return (
    <LogoForm
      heading="Forgot password 🔑"
      subHeading="Please enter the email you use to sign up"
      onSubmit={({ email }) => {
        forgotPassword(email ? { email } : { email: context?.emailOrPhone });
      }}
      submitText="Send Link"
      methods={methods}
      isSuccess={isLoading}
    >
      <div className="form-group mb-3">
        <Input
          id="email"
          label=""
          type="email"
          placeholder="Enter email"
        />
      </div>
    </LogoForm>
  );
}
