import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from "react";
import instance from "../../axios/axios";

type CartItem = {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: {
    uuid: string;
    name: string;
    imageUrl: string;
    price: number;
  }) => void;
  removeFromCart: (productId: string) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  cartItemCount: number;
  isLoading: boolean;
  isMutating: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  //fetching api using query
  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await instance.get("/cart");
      return response.data.items;
    },
  });

  //Mutation for adding to cart
  const { mutate: addToCartMutation, isPending: isAdding } = useMutation({
    mutationFn: async (product: {
      uuid: string;
      name: string;
      imageUrl: string;
      price: number;
    }) => {
      await instance.post("/cart/add", { productId: product.uuid });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  //Mutation for removing from cart
  const { mutate: removeFromCartMutation, isPending: isRemoving } = useMutation(
    {
      mutationFn: async (productId: string) => {
        await instance.delete(`/cart/remove/${productId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
    }
  );

  //Mutation for updating cart quantity
  const { mutate: updateQuantityMutation, isPending: isUpdating } = useMutation(
    {
      mutationFn: async ({
        productId,
        quantity,
      }: {
        productId: string;
        quantity: number;
      }) => {
        await instance.patch(`/cart/update/${productId}`, { quantity });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
    }
  );

  const addToCart = (product: {
    uuid: string;
    name: string;
    imageUrl: string;
    price: number;
  }) => {
    addToCartMutation(product);
  };

  const removeFromCart = (productId: string) => {
    removeFromCartMutation(productId);
  };

  const incrementQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (item) {
      updateQuantityMutation({
        productId,
        quantity: item.quantity + 1,
      });
    }
  };

  const decrementQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity - 1);
      updateQuantityMutation({
        productId,
        quantity: newQuantity,
      });
    }
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isMutating = isAdding || isUpdating || isRemoving;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        cartItemCount,
        isLoading,
        isMutating,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
