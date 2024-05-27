import { createContext, useContext, useEffect, useState } from "react";
import { getUserCart } from "../api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();
  
export const CartContextProvider = ({children}) => {
    const [cartAmnt, setCartAmnt] = useState(0);
    const {user} = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const config = {withCredentials: true};
            const res = await getUserCart(config, user.userId);
            setCartAmnt(res.data.cart.length)
          } catch (error) {
            console.log(error);
          }
        }
  
        fetchData();
        
      }, [])
  

    return (
        <CartContext.Provider value={{ cartAmnt, setCartAmnt }}>
            {children}
        </CartContext.Provider>
    )
}