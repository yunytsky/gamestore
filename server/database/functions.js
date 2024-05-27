import pool from "./config.js"

//------------------------
//Users
export function findByUsername(username) {
    return pool.execute(`
        SELECT * FROM users
        WHERE username = ?
    `, [username]);
}

export function findByEmail(email) {
    return pool.execute(`
        SELECT * FROM users
        WHERE email = ?
    `,[email]);
}

export function findById(userId) {
    return pool.execute(`
        SELECT * FROM users
        WHERE userId = ?
    `, [userId]);
}

export  function createUser(email, username, password) {
    return pool.execute(`
        INSERT INTO users (email, username, password) 
        VALUES (?, ?, ?)
    `, [email, username, password]);
}

export function changeUserPassword(password, userId) {
    return pool.execute(`
    UPDATE users
    SET password = ?
    WHERE userId = ?
`, [password, userId]);
}

export async function deleteUser(userId) {    
    await pool.execute(`
        DELETE FROM user_game
        WHERE userId = ?
    `, [userId]);

    await pool.execute(`
      DELETE FROM carts
      WHERE userId = ?
    `, [userId]);

    return pool.execute(`
        DELETE FROM users
        WHERE userId = ? 
    `, [userId]);
}

export function getUserDetails(userId) {
    return pool.execute(`
        SELECT * FROM users
        WHERE userId = ?
    `, [userId]);
}

export async function updateUserBalance(balance, userId) {
    return pool.execute(`
        UPDATE users
        SET balance = ?
        WHERE userId = ?
    `, [balance, userId]);
}

export function getUserGamesIds(userId) {
    return pool.execute(`
        SELECT gameId from user_game
        WHERE userId = ?
    `, [userId]);
}

export function getUserGames(userId) {
    return pool.execute(`
        SELECT game.gameId, game.name AS gameName, game.description, game.releaseDate, game.price, game.discount, game.image, genre.name AS genreName
        FROM games game
        INNER JOIN game_genre gamegenre
        ON gamegenre.gameId = game.gameId
        INNER JOIN genres genre
        ON genre.genreId = gamegenre.genreId
        WHERE game.gameId IN (SELECT gameId FROM user_game WHERE userId = ?)
    `, [userId]);
}

export async function addUserGame(userId, gameId) {
    return pool.execute(`
        INSERT INTO user_game
        VALUES(?, ?)
    `, [userId, gameId]);
}

//------------------------
//Games
export function getGamesWithGenres() {
    return pool.execute(`
        SELECT game.gameId, game.name AS gameName, game.description, game.releaseDate, game.price, game.discount, game.image, genre.name AS genreName
        FROM games game
        INNER JOIN game_genre gamegenre
        ON gamegenre.gameId = game.gameId
        INNER JOIN genres genre
        ON genre.genreId = gamegenre.genreId
    `);
}

export function getGameWithGenres(gameId) {
    return pool.execute(`
        SELECT game.gameId, game.name AS gameName, game.description, game.releaseDate, game.price, game.discount, game.image, genre.name AS genreName
        FROM games game
        INNER JOIN game_genre gamegenre
        ON gamegenre.gameId = game.gameId
        INNER JOIN genres genre
        ON genre.genreId = gamegenre.genreId
        WHERE game.gameId = ?
    `, [gameId]);
}

export function getGame(gameId) {
    return pool.execute(`
        SELECT * FROM games
        WHERE gameId = ?
    `, [gameId]);
}

//------------------------
//Cart
export function insertToCart(userId, gameId) {
    return pool.execute(`
        INSERT INTO carts
        VALUES(?,?)
    `, [userId, gameId]);
}

export function deleteFromCart(userId, gameId) {
    return pool.execute(`
        DELETE FROM carts
        WHERE userId = ? AND gameId = ?
    `, [userId, gameId]);
}


export function getUserCartGames(userId) {
    return pool.execute(
      `
        SELECT 
        game.gameId, 
        game.name AS gameName, 
        game.description, 
        game.releaseDate, 
        game.price, 
        game.discount, 
        game.image, 
        genre.name AS genreName
        FROM games game
        INNER JOIN game_genre gamegenre ON gamegenre.gameId = game.gameId
        INNER JOIN genres genre ON genre.genreId = gamegenre.genreId
        WHERE game.gameId IN (SELECT gameId FROM carts WHERE userId = ?)
    `,
      [userId]
    );
}

export function getUserCartGamesIds(userId) {
    return pool.execute(
      `
        SELECT gameId FROM carts WHERE userId = ?
    `,
      [userId]
    );
}

//------------------------
//Auth
export function createVerificationInstance(email, code, expiresIn, type) {
    return pool.execute(`
    INSERT INTO verifications(email, code, expireAt, type)
    VALUES(?, ?, NOW() + INTERVAL ? MINUTE, ?)
`, [email, code, expiresIn, type])
}

export function getVerificationInstance(email, type) {
    return pool.execute(`
    SELECT * FROM verifications
    WHERE email = ? AND type = ?
`, [email, type]) 
}

export function updateVerificationInstance(code, expiresIn, verificaionId) {
    return pool.execute(`
    UPDATE verifications
    SET code = ?, expireAt = NOW() + INTERVAL ? MINUTE
    WHERE verificationId = ?
`, [code, expiresIn, verificaionId]) 
}

export function updateVerificationInstanceConfirmationStatus(status, verificaionId) {
    return pool.execute(`
    UPDATE verifications
    SET confirmed = ?
    WHERE verificationId = ?
`, [status, verificaionId]) 
}


export function deleteVerificationInstance(verificaionId) {
    return pool.execute(`
    DELETE FROM verifications
    WHERE verificationId = ?
`, [verificaionId]) 
}

export function updateUserVerifiedStatus(status, userId) {
    return pool.execute(`
        UPDATE users
        SET verified = ? WHERE userId = ?
    `, [status, userId]);
}

export function updateUserEmail(email, userId) {
    return pool.execute(`
        UPDATE users
        SET email = ? WHERE userId = ?
    `, [email, userId]);
}
