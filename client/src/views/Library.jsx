import { useEffect, useState } from "react";
import { getUserGames } from "../api";
import { formatDate } from "../lib/utils";
import { useNavigate } from "react-router-dom";

const Library = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const config = {withCredentials: true};
          const res = await getUserGames(config);
          setGames(res.data.games);
        } catch (error) {
          console.log(error)
        }
      }

      fetchData();
   
    }, [])
    
    return (
      <div className="library">
        <h3>My library</h3>

        {games.length > 0 ? (
          <div className="library-games">
            {games.map((game, index) => (
              <div className="library-game" key={index} onClick={() => {navigate(`/store/game/${game.gameId}`)}}>
                <div className="library-game-image">
                  <img src={game.image} alt="game-image" />
                  <div className="overlay"></div>
                </div>
                <div className="library-game-info">
                  <h4 className="library-game-name">{game.name}</h4>
                  <p className="library-game-genres">Genres: {game.genres.map((genre, i) => (i==game.genres.length-1 ? genre + "" : genre + ", ") )}</p>
                  <p className="library-game-released-date">
                    Released: {formatDate(game.releaseDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No games purchased</p>
        )}
      </div>
    );
}

export default Library;