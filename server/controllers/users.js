import { addUserGame, deleteFromCart, findById, getGame, getUserCartGames, getUserCartGamesIds, getUserGames, getUserGamesIds, insertToCart, updateUserBalance } from "../database/functions.js";
import { makeTransaction } from "../lib/utils.js";


export async function getUser(req, res) {
    try {
        const [data] = await findById(req.user.sub);
        const user = data[0];
        delete user.password;

        return res.status(200).json({error: false, message: "Success", user: user});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
};

export async function getPurchasedGames(req, res) {
    try {
        const [rows] = await getUserGames(req.user.sub);
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

export async function addToCart(req, res) {
    try {       
        //Check if game is not already in a cart
        const [userCartGameIdsData] = await getUserCartGamesIds(req.user.sub);
        const userCartGameIds = userCartGameIdsData.map(obj => obj.gameId)
        if(userCartGameIds.some(id => id == req.body.gameId)){
            return res.status(400).json({error: true, message: "Game is already in the cart"});
        } 
        
        //Check if user already owns the game
        const [userGameIdsData] = await getUserGamesIds(req.user.sub);
        const userGameIds = userGameIdsData.map(obj => obj.gameId)
        if(userGameIds.some(id => id == req.body.gameId)){
            return res.status(400).json({error: true, message: "Game is already purchased"});
        } 

        await insertToCart(req.user.sub, req.body.gameId);        
        return res.status(200).json({error: false, message: "Successfully added"});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
};

export async function removeFromCart(req, res) {
    try {       
        //Check if game is in a cart
        const [userCartGameIdsData] = await getUserCartGamesIds(req.user.sub);
        const userCartGameIds = userCartGameIdsData.map(obj => obj.gameId)
        if(!userCartGameIds.some(id => id == req.body.gameId)){
            return res.status(400).json({error: true, message: "Game is not in the cart"});
        } 

        await deleteFromCart(req.user.sub, req.body.gameId);        
        return res.status(200).json({error: false, message: "Successfully removed"});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
};

export async function getUserCart(req, res) {
    try {        
        const [rows] = await getUserCartGames(req.user.sub);        
        const cartMap = new Map();
    
        //Adding genres
        rows.forEach(row => {
            const gameId = row.gameId;
    
            if (!cartMap.has(gameId)) {
                cartMap.set(gameId, {
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
    
            cartMap.get(gameId).genres.push(row.genreName);
        });
    
        // Convert the map values
        const cart = Array.from(cartMap.values());
        return res.status(200).json({error: false, message: "Success", cart: cart});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
};

export async function addFunds(req, res) {
    try {        
        const [userData] = await findById(req.user.sub);
        const user = userData[0];

        await makeTransaction(req.body.cardNumber, req.body.expiryDate, req.body.cvv, req.body.amount)
        const balance = user.balance + req.body.amount;

        await updateUserBalance(balance, req.user.sub);       

        user.balance = user.balance + req.body.amount;

        return res.status(200).json({error: false, message: "Funds successfully added", user: user});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: true, message: error.message});
    }
};

export async function buyGames(req,res) {
    try {        
        const [userData] = await findById(req.user.sub);
        const user = userData[0];        

        const [rows] = await getUserCartGames(req.user.sub);
        const cartMap = new Map();
        rows.forEach(row => {
            const gameId = row.gameId;
    
            if (!cartMap.has(gameId)) {
                cartMap.set(gameId, {
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
    
            cartMap.get(gameId).genres.push(row.genreName);
        });

        const cart = Array.from(cartMap.values());

        if(cart.length < 1){
            return res.status(400).json({error: true, message: "No items to purschase"});
        }

        let finalPrice = 0;
        cart.forEach(game => {
            finalPrice += game.price - ((game.discount/100) * game.price);
        })

        //Check the balance
        if(user.balance < finalPrice){
            return res.status(400).json({error: true, message: "Insufficient funds"});
        }else{
            for (const game of cart) {
                await addUserGame(req.user.sub, game.gameId);
                let balance = user.balance - finalPrice;
                await updateUserBalance(balance, req.user.sub);
                user.balance = user.balance - finalPrice;
                await deleteFromCart(req.user.sub, game.gameId);        
            }

            return res.status(200).json({error: false, message: "Game successfully purchased", user: user});
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: true, message: error.message});
    }
}


