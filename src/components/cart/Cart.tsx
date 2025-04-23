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
    <div>
      <h1>Your Cart</h1>
      {cartItemCount === 0 ? (
        <div>
          <p> Your cart is Empty</p>
          <Link to="/home"> Continue Shopping</Link>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.productId} className="">
              <div>
                <img src={item.imageUrl} alt={item.name} className="" />
                <div>
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <button onClick={() => decrementQuantity(item.productId)}>
                  -
                </button>

                <span>{item.quantity}</span>
                <button onClick={() => incrementQuantity(item.productId)}>
                  +
                </button>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div>
            <div>
              <h3>Total: ${totalPrice.toFixed(2)}</h3>
              <button>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
