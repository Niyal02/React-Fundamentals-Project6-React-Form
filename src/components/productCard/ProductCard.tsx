import { ReactNode } from "react";

const ProductCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-4">
      {children}
    </div>
  );
};

export default ProductCard;
