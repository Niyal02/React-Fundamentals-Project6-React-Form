import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    cartItemCount,
    isLoading,
    isMutating,
  } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="  max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-orange-700">Your Cart</h1>
      {cartItemCount === 0 ? (
        <div className="text-center py-8 pr-2">
          <p className="text-lg mb-10"> Your cart is Empty</p>
          <Link
            to="/home"
            className="px-4 py-2 cursor-pointer rounded bg-orange-700 text-white hover:bg-orange-600"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-orange-600">
                    ${item.product.price?.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="felx items-center space-x-2">
                <button
                  disabled={isMutating(item.productId)}
                  onClick={() => decrementQuantity(item.productId)}
                  className={`px-2 py-1 bg-gray-200 rounded ${
                    isMutating(item.productId)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-300"
                  }`}
                >
                  -
                </button>

                <span>{item.quantity}</span>
                <button
                  disabled={isMutating(item.productId)}
                  onClick={() => incrementQuantity(item.productId)}
                  className={`px-2 py-1 bg-gray-200 rounded ${
                    isMutating(item.productId)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-300"
                  }`}
                >
                  +
                </button>

                <button
                  disabled={isMutating(item.productId)}
                  onClick={() => removeFromCart(item.productId)}
                  className={`ml-4 ${
                    isMutating(item.productId)
                      ? "opacity-50 cursor-not-allowed text-red-300"
                      : "text-red-500 hover:text-red-700"
                  }`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                Total: ${totalPrice.toFixed(2)}
              </h3>
              <button className="px-4 py-2 bg-orange-600 cursor-pointer text-white rounded hover:bg-orange-700">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
