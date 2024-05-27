// Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import gamesRoutes from "./routes/games.js";
import usersRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";

// Configurations
const app = express();  

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/games", gamesRoutes)
app.use("/users", usersRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack, err.name, err.code);
    res.status(500).json({
        errorMessage: "Something went wrong. Try later."
    })
});

// App
const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})