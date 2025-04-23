import { useCart } from "./CartContext";

const Cart = () => {
  const { cartItems } = useCart();
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1>Your Cart</h1>
    </div>
  );
};

export default Cart;
