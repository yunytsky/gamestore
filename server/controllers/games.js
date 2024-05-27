import {getGamesWithGenres, getGameWithGenres, getUserGamesIds, updateUserBalance } from "../database/functions.js";

export async function getAllGames(req, res) {
    try {
    
    let [rows] = await getGamesWithGenres();
    const gamesMap = new Map();
    
    //Adding genres
    rows.forEach(row => {
        const gameId = row.gameId;

        if (!gamesMap.has(gameId)) {
            gamesMap.set(gameId, {
                gameId: row.gameId,
                name: row.gameName,
                description: row.description,
                releaseDate: row.releaseDate,
                price: row.price,
                discount: row.discount,
                image: row.image,
                genres: []
            });
        }

        gamesMap.get(gameId).genres.push(row.genreName);
    });

    // Convert the map values
    const games = Array.from(gamesMap.values());

    return res.status(200).json({error: false, message: "Success", games: games});
    
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
};

export async function getSingleGame(req, res) {
    try {
        const [rows] = await getGameWithGenres(req.params.gameId);

        let game = null;

        //Adding genres
        rows.forEach(row => {
            if (!game) {
                game = {
                gameId: row.gameId,
                name: row.gameName,
                description: row.description,
                releaseDate: row.releaseDate,
                price: row.price,
                discount: row.discount,
                image: row.image,
                genres: [],
                };
            }

            game.genres.push(row.genreName);
        });
    
        return res.status(200).json({error: false, message: "Success", game: game});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
};
