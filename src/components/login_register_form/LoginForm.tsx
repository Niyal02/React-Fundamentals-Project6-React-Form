import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import login_reg_image from "../../assets/login logo.png";
import PasswordView from "../view_password_icon/PasswordViewIcon";
import axios from "../../axios/axios";
import { useState } from "react";
import { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";

interface LoginValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Validation using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,})?$/,
        "Invalid email"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .required("Password is required"),
  });

  const handleLogin = async (
    values: LoginValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError("");

    try {
      const response = await axios.post<{
        accessToken: string;
      }>("auth/login", values);
      console.log("Login Successful", response.data);

      //After successful login , the token wil be stored
      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/user/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again later"
        );
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="flex h-screen bg-[#dad5cb] items-center justify-center">
      <div className="flex bg-white rounded-2xl shadow-lg w-[950px] h-[600px] overflow-hidden">
        <div className="w-1/2 hidden md:block">
          <img
            src={login_reg_image}
            alt="login-image"
            className="w-[430px] mt-35 h-[320px] object-cover"
          />
        </div>

        <div className="flex flex-col p-8 justify-center items-center md:w-1/2">
          <div className="mb-6 text-center">
            <span className="flex items-center justify-center text-3xl font-bold gap-2 mb-6">
              <span className="text-orange-500"> 🧑‍💻 Rex IT Solutions</span>
            </span>
            <p className="text-2xl mb-4">Sign in to your account</p>
          </div>

          <Formik<LoginValues>
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="w-full">
                <div className="mb-4">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <PasswordView name="password" placeholder="Password" />
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 disabled:bg-amber-600 w-full rounded-md border p-1.5 bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-md transition"
                >
                  {isSubmitting ? (
                    <Loader2Icon className="animate-spin ml-48" />
                  ) : (
                    "LOGIN"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-2.5">
            <a
              className="w-full text-gray-400 cursor-pointer"
              onClick={() => navigate("/404-Page-not-found")}
            >
              Forgot Password?
            </a>
            <p className="mt-1.5">
              Don't have an account?{" "}
              <span
                className="underline text-blue-400 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </p>
            <p className="text-gray-500 text-sm mt-18">
              Copyright © 2025 | Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
