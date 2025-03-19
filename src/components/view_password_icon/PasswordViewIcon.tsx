import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Field, ErrorMessage } from "formik";

const PasswordViewIcon = ({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        <Field
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          className="border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <EyeOffIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </div>
  );
};

export default PasswordViewIcon;
