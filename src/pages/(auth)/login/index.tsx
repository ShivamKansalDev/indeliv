import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import Input from "@/pages/(auth)/components/Input";
import LogoForm from "@/pages/(auth)/components/LogoForm";
import { isLoggedIn } from "@/utils/helper";
import { useGetUserMutation, useLoginMutation } from "@/state/slices/authApiSlice";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import permissions from "@/ennum/permission";
import { LoginUserContext } from "@/App";
interface User {
  id?: number;
  name?: string;
  email?: string;
  role_name?: string;
}
const Login = () => {
  const context = useContext(LoginUserContext)
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const [getUser, { data, isSuccess: isSuccessUser }] = useGetUserMutation();
  useEffect(() => {
    if (isSuccess) {
      getUser()
    }
  }, [isSuccess])
  const [userData, setUserData] = useState<User>({});
  // useEffect(() => {
  //   if (data) {
  //     setUserData(data); // Update state when data is available
  //   }
  // }, [data, isSuccessUser]);
  // console.log(data?.role_name, "======>>>>")
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess || isLoggedIn()) {
      context?.setAuthContext("Auth")
      context?.setLoginUserData({ ...data });
      navigate("/dashboard");
      // if (data?.role_name) {
      //   console.log(data?.role_name, "asff")
      //   if (data?.role_name == permissions?.role_name) {
      //     console.log(data?.role_name, "batches")
      //     navigate("/dashboard/batches/deliveries");
      //   }
      //   else if (data?.role_name == permissions?.role_collection) {
      //     console.log(data?.role_name, "collcetion")
      //     navigate("/dashboard/batches/collections");
      //   }
      //   else if (data?.role_name != permissions?.role_name || data?.role_name != permissions?.role_collection) {
      //     console.log(data?.role_name, "invoices")
      //     navigate("/dashboard/invoices");
      //   }
      // } else {
      //   navigate("/");
      // }
    }
  }, [isSuccess, isLoggedIn(), data]);

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().required("required"),
        password: yup.string().required("required"),
      })
    ),
  });

  useEffect(() => {
    if (isError) {
      methods.setError("password", {
        type: "custom",
        message: "Invalid email or password",
      });
      methods.setError("email", {
        type: "custom",
        message: "",
      });
    }
  }, [isError]);

  return (
    <div className="login-page">
      <LogoForm
        heading="Welcome!"
        subHeading="Welcome! Please Enter your Details."
        onSubmit={({ email, password }) => {
          login({ email, password });
        }}
        submitText="Log in"
        methods={methods}
        footer={
          <div className="d-flex align-items-center flex-column text-center">
            <div className="or-container">
              <div></div>
              <span className="px-10">OR</span>
              <div></div>
            </div>
            <button
              type="button"
              className="rounde btn btn-secondary google-button"
            >
              <img className="" src={"/assets/image/icon-google.svg"} alt="" />
              Log in with google
            </button>

            <div className="bouttonG mt-3 w-lg-100 sign">
              Don't have an account yet? <Link to={""}>Sign up</Link>
            </div>
          </div>
        }
      >
        <div className="form-group mb-3">
          <Input
            id="email"
            // label="Name / Email"
            validations={{ required: "required" }}
            placeholder="Username / Email"
          />
        </div>
        <div className="form-group mb-2">
          <Input
            validations={{ required: "required" }}
            type="passwordToggle"
            id="password"
            placeholder="Password"
          // label="Password"
          />
        </div>
        <div className="forgot form-group form-check d-flex justify-content-between align-items-center mx-0 px-0">
          <div className="d-flex align-items-center gap-2 ">
            <input
              type="checkbox"
              className="w-16 h-16 m-0 remember-check"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Remember
            </label>
          </div>
          <Link to="/forgot-password" className="text12">
            Forgot password?
          </Link>
        </div>
        <span className="message error"></span>
        <span className="message loading">{isLoading && "Loading..."}</span>
      </LogoForm>
    </div>
  );
};

export default Login;
