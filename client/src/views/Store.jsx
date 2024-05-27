import { useContext, useEffect, useState } from "react";
import { addToCart, getGames } from "../api";
import { formatDate } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Store = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const {user} = useContext(AuthContext);

    const [successMessage, setSuccessMessage] = useState({visible: false, message: ""});
    const [errorMessage, setErrorMessage] = useState({visible: false, message: ""});

    const {setCartAmnt} = useContext(CartContext);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getGames({});
          setGames(res.data.games);
        } catch (error) {
          console.log(error)
        }
      }

      fetchData();
   
    }, [])
    

    const handleAddToCart = async (gameId) => {
      try {
        if(errorMessage.visible){
          setErrorMessage({error: false, message: ""});
        }
        if(successMessage.visible){
          setSuccessMessage({error: false, message: ""});
        }
        const config = {withCredentials: true};
        const res = await addToCart(config, {gameId}, user.userId);

        setCartAmnt(prevAmnt => prevAmnt + 1)

        setSuccessMessage({visible: true, message: "Added"});
        setTimeout(() => {
          setSuccessMessage({visible: false, message: ""})
        }, 7000);
      } catch (error) {
        let message = "Error"
        if(error.response && error.response.status == 400 && error.response.data){
          message = error.response.data.message;
        }
        setErrorMessage({visible: true, message: message});
        setTimeout(() => {
          setErrorMessage({visible: false, message: ""})
        }, 7000);
      }
    }

    
    const handleBuyNow = async (gameId) => {
      try {
        if(errorMessage.visible){
          setErrorMessage({error: false, message: ""});
        }
        const config = {withCredentials: true};
        const res = await addToCart(config, {gameId}, user.userId);
        
        setCartAmnt(prevAmnt => prevAmnt + 1)

        navigate("/purchase", {state: { navigated: true }})
      } catch (error) {
        console.log(error)
        let message = "Error"
        if(error.response && error.response.status == 400 && error.response.data){
          message = error.response.data.message;
        }
        setErrorMessage({visible: true, message: message});
        setTimeout(() => {
          setErrorMessage({visible: false, message: ""})
        }, 7000);
      }
    }


    
    return (
      <div className="store">
        <h3>Explore</h3>
        <div className="store-searchbar">
          <input type="text" placeholder="Search..." />
        </div>
        {games.length > 0 ? (
          <div className="store-games">
            {games.map((game, index) => (
              <div className="store-game" key={index} onClick={() => {navigate(`game/${game.gameId}`)}}>
                <div className="store-game-image">
                  <img src={game.image} alt="game-image" />
                  <div className="overlay"></div>
                </div>
                <div className="store-game-info">
                  <div className="store-game-price">
                    {game.discount > 0 ? (
                      <>
                        <div className="store-game-price-discount">-{game.discount}%</div>
                        <div className="store-game-price-old">${game.price}</div>
                        <div className="store-game-price-new">${game.price - ((game.discount / 100) * game.price)}</div>
                      </>
                    ) : (
                      "$" + game.price
                    )}
                  </div>
                  <h4 className="store-game-name">{game.name}</h4>
                  <p className="store-game-genres">Genres: {game.genres.map((genre, i) => (i==game.genres.length-1 ? genre + "" : genre + ", ") )}</p>
                  <p className="store-game-released-date">
                    Released: {formatDate(game.releaseDate)}
                  </p>
                </div>
                <div className="store-game-actions actions">
                  <button className="store-game-button button empty" onClick={(e) => {e.stopPropagation(); handleAddToCart(game.gameId)}}>
                    Add to cart
                  </button>
                  <button className="store-game-button button" onClick={(e) => {e.stopPropagation(); handleBuyNow(game.gameId)}}>Buy now</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No games available</p>
        )}

        {successMessage.visible && (<div className="success-message">{successMessage.message} <span>✅</span> </div>)}
        {errorMessage.visible && (<div className="error-message">{errorMessage.message} <span>❌</span></div>)}

      </div>
    );
}

export default Store;