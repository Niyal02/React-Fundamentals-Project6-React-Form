import { useNavigate } from "react-router-dom";
import login_reg_image from "../assets/login.png";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex h-screen bg-[#dad5cb] items-center justify-center">
      <div className=" flex bg-white rounded-2xl shadow-lg w-[950px] h-[600px] overflow-hidden">
        <div className="w-1/2 hidden md:block">
          <img
            src={login_reg_image}
            alt="login-image"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col p-8 justify-center items-center md:w-1/2">
          <div className="mb-6 text-center">
            <span className=" flex items-center justify-center text-3xl font-bold gap-2 mb-6">
              <span className="text-orange-500">⬢ Tech Rex</span>
            </span>
            <p className=" text-2xl mb-4 ">Sign in to your account</p>
          </div>

          <div className="w-full">
            <input
              type="email"
              placeholder="Email address"
              className=" border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200 mb-4"
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200 mb-4"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 pb-3.5 flex items-center cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <button className="w-full rounded-md border p-1.5 bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-md transition">
              LOGIN
            </button>
          </div>

          <div className="text-center mt-2.5">
            <a href="login" className="w-full text-gray-400">
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
            <p className="text-gray-500 text-sm mt-18 ">
              Copyright © 2025 | Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
