import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { buyGames, getUserCart } from "../api";
import { AuthContext } from "../context/AuthContext";


const Purchase = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const {user, setUser} = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const config = {withCredentials: true};
              const res = await getUserCart(config, user.userId);
              if(res.data.cart.length < 1){
                navigate("/store")
              }
              setCartItems(res.data.cart);

              let price = 0;
              res.data.cart.forEach(game => {
                price += game.price - ((game.discount / 100) * game.price)
              })

              setTotalPrice(price);

            } catch (error) {
              console.log(error)
            }
          }
          
          if(!state || !state.navigated) {
            navigate("/store")
          }else{
            fetchData();
          }
    }, [])

    const handlePay = async () => {
        try {
            const config = {withCredentials: true};
            const res = await buyGames(config, {}, user.userId);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user);
            navigate("/successfull-purchase", {state: {navigated: true}})
        } catch (error) {
            console.log(error)
            if(error.response && error.response.status == 400 && error.response.data.message == "Insufficient funds"){
                navigate("/insufficient-funds")
            }
        }
    }

    return (
      <div className="purchase">
        <h3>Purchase</h3>
        <div className="purchase-details">
          {cartItems.map((game, index) => (
            <div key={index} className="purchase-game">
              <div className="purchase-game-name">{game.name}</div>
              <div className="purchase-game-price">${game.price - ((game.discount/100) * game.price)}</div>
            </div>
          ))}
        </div>
        <p className="purchase-text">
          After pressing the button, funds will be debited from the balance.
        </p>

        <button className="successfull-purchase-button button" onClick={handlePay}>Pay ${totalPrice}</button>
      </div>
    );
}

export default Purchase;