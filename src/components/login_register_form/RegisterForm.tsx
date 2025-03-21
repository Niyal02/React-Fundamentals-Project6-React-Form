import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axios/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import login_reg_image from "../../assets/login logo.png";
import PasswordView from "../view_password_icon/PasswordViewIcon";
import { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // const notify = () => toast("Account Registered Succcessfully 🎉");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("accessToken");
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Validation using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
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
    // confirmPassword: Yup.string()
    //   .oneOf([Yup.ref("password")], "Password must match")
    //   .required("Confirm Password is required"),
  });

  const handleRegister = async (
    values: RegisterValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setError("");
    try {
      const response = await axios.post("auth/signup", values);

      console.log("Registration Successful:", response.data);

      toast.success("Account Registered Successfully 🎉");

      setTimeout(() => {
        navigate("/");
      }, 3000);
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
      <div className=" flex bg-white rounded-2xl shadow-lg w-[950px] h-[600px] overflow-hidden">
        <div className="w-1/2 hidden md:block">
          <img
            src={login_reg_image}
            alt="login-image"
            className="w-[430px] mt-35 h-[320px] object-cover"
          />
        </div>

        <div className="flex flex-col p-8 justify-center items-center md:w-1/2">
          <div className="mb-6 text-center">
            <span className=" flex items-center justify-center text-3xl font-bold gap-2 mb-7">
              <span className="text-orange-500">🧑‍💻 Rex IT Solutions</span>
            </span>
            <p className="text-2xl mb-3 ">Create a new account</p>
          </div>

          <Formik<RegisterValues>
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              // confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form className="w-full">
                <div className="flex flex-col gap-4">
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />

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

                  <PasswordView name="password" placeholder="Password" />
                  {/* <PasswordView
                    name="confirmPassword"
                    placeholder="Confirm Password"
                  /> */}

                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    // onClick={notify}
                    className="mt-4 w-full rounded-md border p-1.5 bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-md transition"
                  >
                    {isSubmitting ? (
                      <Loader2Icon className="animate-spin ml-48" />
                    ) : (
                      "REGISTER"
                    )}
                  </button>
                  <Toaster />
                </div>
              </Form>
            )}
          </Formik>
          <div className="text-center mt-2.5">
            <p className="mt-1.5">
              Already have an account?{" "}
              <span
                className="underline text-blue-400 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
