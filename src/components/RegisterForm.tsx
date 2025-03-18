import { useNavigate } from "react-router-dom";
import login_reg_image from "../assets/login.png";

const RegisterForm = () => {
  const navigate = useNavigate();
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
            <span className=" flex items-center justify-center text-3xl font-bold gap-2 mb-7">
              <span className="text-orange-500">⬢ Tech Rex</span>
            </span>
            <p className="text-2xl mb-3 ">Create a new account</p>
          </div>

          <div className="w-full">
            <input
              type="name"
              placeholder="Username"
              className=" border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200 mb-4"
            />

            <input
              type="email"
              placeholder="Email address"
              className=" border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200 mb-4"
            />

            <input
              type="password"
              placeholder="Password"
              className=" border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200 mb-4"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200 mb-4"
            />

            <button
              className="w-full rounded-md border p-1.5 bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-md transition"
              onClick={() => navigate("/")}
            >
              REGISTER
            </button>
          </div>

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
