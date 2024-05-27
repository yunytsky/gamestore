import { useParams } from "react-router-dom";
import gameImage from "../assets/dst.webp"
import { useEffect, useState } from "react";
import { getGame } from "../api";
import { formatDate } from "../lib/utils";

const Game = () => {
  const [game, setGame] = useState(null);
  const {gameId} = useParams()

  useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await getGame({}, gameId);
          setGame(res.data.game);
        } catch (error) {
          console.log(error)
        }
      }

      fetchData();
   
    }, [gameId])

  return (
    <div className="game">
      <div className="game-image">
        <img src={gameImage} alt="" />
      </div>
      {game ? (
        <div className="game-info">
          <h2 className="game-title">{game.name}</h2>
          <p className="game-description">{game.description}</p>
          <p className="game-genres">
            Genres:{" "}
            {game.genres.map((genre, i) =>
              i == game.genres.length - 1 ? genre + "" : genre + ", "
            )}
          </p>
          <p className="game-released-date">
            Release date: {formatDate(game.releaseDate)}
          </p>
          <h4 className="game-price">
            {game.discount > 0 ? (
              <>
                <div className="game-price-discount">
                  -{game.discount}%
                </div>
                <div className="game-price-old">${game.price}</div>
                <div className="game-price-new">
                  ${game.price - (game.discount / 100) * game.price}
                </div>
              </>
            ) : (
              "$" + game.price
            )}
          </h4>
          <div className="actions">
            <button className="button empty">Add to cart</button>
            <button className="button">Buy now</button>
          </div>
        </div>
      ) : (
        <p className="no-data">No data available</p>
      )}
    </div>
  );
};

export default Game;
