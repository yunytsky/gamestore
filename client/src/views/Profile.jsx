import profileFilledIcon from "../assets/profile-filled.svg";
import controllerIcon from "../assets/controller-filled.svg";
import dollarIcon from "../assets/dollar.svg";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserGames } from "../api";


const Profile = () => {
    const {user} = useContext(AuthContext);
    const [gamesAmount, setGamesAmount] = useState(0);
    
    useEffect(() => { 
        const fetchData = async () => {
            const config = {withCredentials: true};
            const res = await getUserGames(config);
            setGamesAmount(res.data.games.length);
        }

        fetchData();
    }, [])

    return(
        <div className="profile">
            <div className="profile-username">
                <img src={profileFilledIcon} alt="profile icon" />
                <h3>{user.username}</h3>
            </div>
            <div className="profile-info">
                <div className="profile-games">
                    <span>Games</span>
                    <div className="profile-games-amount">
                        <img src={controllerIcon} alt="controller icon" />
                        <h3>{gamesAmount}</h3>
                    </div>
                </div>
                <div className="profile-balance">
                    <span>Balance</span>
                    <div className="profile-balance-amount">
                        <img src={dollarIcon} alt="dollar icon" />
                        <h3>{user.balance.toFixed(2)}</h3>
                    </div>
                </div>
            </div>
            <Link className="profile-button button">
                Add funds
            </Link>
        </div>
    );
}

export default Profile;