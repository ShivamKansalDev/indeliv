import "../login/style.scss";
import LogoForm from "@/pages/(auth)/components/LogoForm";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/state/slices/authApiSlice";
import Input from "@/pages/(auth)/components/Input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

export default function () {
  const [forgotPassword, { data, isLoading, isSuccess, isError, error }] =
    useForgotPasswordMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate(`/reset-password?reset_token=${data?.reset_token}`);
    }
  }, [isSuccess]);

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email("Invalid email").required("required"),
      })
    ),
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
        forgotPassword({ email });
      }}
      submitText="Send link"
      methods={methods}
    >
      <div className="form-group mb-3">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
      </div>
    </LogoForm>
  );
}
