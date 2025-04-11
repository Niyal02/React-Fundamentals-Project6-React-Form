import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  useEffect(() => {
    if (isHovered && thumbnailRef.current) {
      const rect = thumbnailRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8, //  margin
        left: rect.left + rect.width / 2 - 128, // Centered (256px wide)
      });
    }
  }, [isHovered]);

  return (
    <>
      <div
        ref={thumbnailRef}
        className={`relative ${sizeClasses[size]} rounded-md bg-gray-200 overflow-hidden ${className}`}
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

      {isHovered &&
        src &&
        createPortal(
          <div
            className="fixed z-[1000] w-94 h-88 bg-white p-1 shadow-lg rounded-md border border-gray-200"
            style={{ top: position.top, left: position.left }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={src}
              alt={`Preview: ${alt}`}
              className="w-full h-full object-contain"
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default Image;
