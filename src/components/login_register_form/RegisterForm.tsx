import { useNavigate } from "react-router-dom";
import login_reg_image from "../../assets/login logo.png";
import PasswordView from "../view_password_icon/PasswordViewIcon";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

const RegisterForm = () => {
  const navigate = useNavigate();

  // Validation using Yup
  const validationSchema = Yup.object({
    fullname: Yup.string().required("Fullname is required"),
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password must match")
      .required("Confirm Password is required"),
  });
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

          <Formik
            initialValues={{
              fullname: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => console.log("Register data:", values)}
          >
            {({ isSubmitting }) => (
              <Form className="w-full">
                <div className="flex flex-col gap-4">
                  <div>
                    <Field
                      type="text"
                      name="fullname"
                      placeholder="Full Name"
                      className="border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                    <ErrorMessage
                      name="fullname"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
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

                  <PasswordView placeholder="Password" name="password" />
                  <PasswordView
                    placeholder="Confirm Password"
                    name="confirmPassword"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full rounded-md border p-1.5 bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-md transition"
                >
                  REGISTER
                </button>
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
