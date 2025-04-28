import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, ReactNode, useState } from "react";
import instance from "../../axios/axios";

type CartContextType = {
  cart: GetCartResponse | undefined;
  addToCart: (productId: string) => boolean;
  removeFromCart: (productId: string) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  cartItemCount: number;
  isLoading: boolean;
  isMutating: (productId?: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export interface GetCartResponse {
  userId: string;
  items: Item[];
  total: number;
}

export interface Item {
  product: Product;
  subtotal: number;
  quantity: number;
}

export interface Product {
  uuid: string;
  name: string;
  imageUrl: string;
  price: number;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [mutatingProductId, setMutatingProductId] = useState<string | null>(
    null
  );

  //fetching cart api using query
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await instance.get<GetCartResponse>("/cart");
      return response?.data;
    },
  });

  //Mutation for adding to cart
  const { mutate: addToCartMutation } = useMutation({
    mutationFn: async (productId: string) => {
      setMutatingProductId(productId);
      await instance.post("/cart/add", {
        product: productId,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSettled: () => {
      setMutatingProductId(null);
    },
  });

  //Mutation for removing from cart
  const { mutate: removeFromCartMutation } = useMutation({
    mutationFn: async (productId: string) => {
      setMutatingProductId(productId);
      await instance.delete(`/cart/remove/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSettled: () => {
      setMutatingProductId(null);
    },
  });

  //Mutation for updating cart quantity
  const { mutate: updateQuantityMutation } = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      setMutatingProductId(productId);
      await instance.patch(`/cart/update/${productId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSettled: () => {
      setMutatingProductId(null);
    },
  });

  const addToCart = (productId: string) => {
    if (!isAuthenticated()) {
      return false;
    }
    addToCartMutation(productId);
    return true;
  };

  const removeFromCart = (productId: string) => {
    removeFromCartMutation(productId);
  };

  const incrementQuantity = (productId: string) => {
    const item = cart?.items.find((item) => item.product.uuid === productId);
    if (item) {
      updateQuantityMutation({
        productId,
        quantity: item.quantity + 1,
      });
    }
  };

  const decrementQuantity = (productId: string) => {
    const item = cart?.items.find((item) => item.product.uuid === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity - 1);
      updateQuantityMutation({
        productId,
        quantity: newQuantity,
      });
    }
  };

  const cartItemCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const isMutating = (productId?: string) => {
    if (!productId) return false;
    return mutatingProductId === productId;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
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
