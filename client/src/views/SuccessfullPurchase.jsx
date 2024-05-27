import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SuccessfullPurchase = () => {
    const {state} = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(!state || !state.navigated){
            navigate("/store");
        }
    }, [])

    return (
      <div className="successfull-purchase">
        <h3>✔ Game successfully purchased</h3>
        <p className="successfull-purchase-text">
          Game has been successfully purchased, you can see the update in your library.
        </p>

        <Link to={"/library"} className="successfull-purchase-button button">To library</Link>
      </div>
    );
}

export default SuccessfullPurchase;