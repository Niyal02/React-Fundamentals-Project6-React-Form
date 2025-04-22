import React from 'react'
import { useState } from 'react'

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    const addToCart = () => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) = item.productId === product.uuid)
            if (existingItem) {
                return prevItems.map((item) => item)
            }
        })
    }
  return (
   <CartContext.Provider value={{cartItems}}>

   </CartContext.Provider>
  )
}

