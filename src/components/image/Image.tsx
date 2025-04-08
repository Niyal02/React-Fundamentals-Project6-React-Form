import { useState } from "react";

type ImageProps = {
  src?: string;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg"; // Optional size prop
};

const Image = ({
  src,
  alt = "Image",
  className = "",
  size = "md",
}: ImageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div className="relative">
      {/* Thumbnail Image */}
      <div
        className={`${sizeClasses[size]} rounded-md bg-gray-200 overflow-hidden ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Hover Preview */}
      {isHovered && src && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 p-4">
          <div className="max-w-[600px] max-h-[600px] border-2 border-white rounded-lg overflow-hidden">
            <img
              src={src}
              alt={`Preview: ${alt}`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Image;
