import crossIcon from "../assets/cross.svg";
import { useContext, useEffect, useState } from "react";
import { getUserCart, removeFromCart } from "../api";
import { formatDate } from "../lib/utils";
import { AuthContext } from "../context/AuthContext";
import {useNavigate} from "react-router-dom"
import { CartContext } from "../context/CartContext";
const Cart = () => {
  const navigate = useNavigate();
    const {user} = useContext(AuthContext);
    const {setCartAmnt} = useContext(CartContext);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const config = {withCredentials: true};
            const res = await getUserCart(config, user.userId);
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
  
        fetchData();
     
      }, [])

        

      const handleDeleteFromCart = async (gameId) => {
        try {
          const config = {withCredentials: true};
          const res = await removeFromCart(config, {gameId}, user.userId);
          setCartItems((prevCartItems) => {
            return [...prevCartItems].filter(game => game.gameId !== gameId)
          })
          setCartAmnt(prevAmnt => prevAmnt - 1)


        } catch (error) {
          console.log(error)
        }
      }

      const handleCheckout = () => {
        try {
          navigate("/purchase", {state: { navigated: true }})
        } catch (error) {
          console.log(error);
        }
      }
  
    return (
      <div className="cart">
        <h3>Cart</h3>
        {cartItems.length > 0 ? (
          <>
            <div className="cart-items">
              {cartItems.map((game, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-left">
                    <div className="cart-item-image">
                      <img src={game.image} alt="game image" />
                    </div>
                    <div className="cart-item-details">
                      <h5 className="cart-item-name">{game.name}</h5>
                      <p className="cart-item-genres">
                        Genres:{" "}
                        {game.genres.map((genre, i) =>
                          i == game.genres.length - 1
                            ? genre + ""
                            : genre + ", "
                        )}
                      </p>
                      <p className="cart-item-released-date">
                        Released: {formatDate(game.releaseDate)}
                      </p>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <div className="cart-item-price">
                      ${game.price - (game.discount / 100) * game.price}
                    </div>
                    <button
                      className="cart-item-delete-button"
                      onClick={() => {handleDeleteFromCart(game.gameId)}}
                    >
                      <img src={crossIcon} alt="delete" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total-price">Total: ${totalPrice}</div>
            <button className="cart-button button" onClick={handleCheckout}>Checkout</button>
          </>
        ) : (
          <p className="no-data">No games added</p>
        )}
      </div>
    );
}

export default Cart;