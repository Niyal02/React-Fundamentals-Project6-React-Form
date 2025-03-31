import ErrorImage from "../../assets/alien.svg";

const Products = () => {
  return (
    <div className="flex flex-col h-screen bg-[#dad5cb] items-center justify-center">
      <img
        src={ErrorImage}
        alt="login-image"
        className="w-[700px] h-[400px] mb-20 "
      />
      <h1 className="text-4xl font-bold ">Page Not Found!</h1>
    </div>
  );
};

export default Products;
