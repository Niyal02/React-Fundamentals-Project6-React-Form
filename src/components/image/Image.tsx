import { useState } from "react";

type ImageProps = {
  src?: string;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const Image = ({
  src,
  alt = "Image",
  className = "",
  size = "md",
}: ImageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size classes for thumbnails
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

      {/* Hover Preview - positioned below thumbnail */}
      {isHovered && src && (
        <div
          className="absolute left-0 z-50 mt-1 bg-white p-1 shadow-lg rounded-md border border-gray-200"
          style={{
            width: "8cm",
            height: "8cm",
            minWidth: "8cm", // Ensures it doesn't shrink
            minHeight: "8cm", // Ensures it doesn't shrink
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={src}
              alt={`Preview: ${alt}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Image;
