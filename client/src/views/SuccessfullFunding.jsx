import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SuccessfullFunding = () => {
    const {state} = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(!state || !state.navigated){
            navigate("/store");
        }
    }, [])

    return (
      <div className="successfull-funding">
        <h3>✔ Funds added</h3>
        <p className="successfull-funding-text">
          Funds have been successfully added, you can start shopping now
        </p>

        <Link to={"/store"} className="successfull-funding-button button">To store</Link>
      </div>
    );
}

export default SuccessfullFunding;