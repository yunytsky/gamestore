import errorIcon from "../assets/warning.svg";
import { Link } from "react-router-dom";

const InsufficientFunds = () => {
    return (
      <div className="insufficient-funds error-page">
        <div className="error-name">
          <img src={errorIcon} alt="error icon" />
          <h3>Insufficient funds</h3>
        </div>
        <p className="error-text">
          You don’t have enough money on your balance to make a purchase. Add
          funds to continue.
        </p>
        <div className="actions">
          <Link className="error-button button empty" to={"/store"}>Go back</Link>
          <Link className="error-button button" to={"/add-funds"}>Add funds</Link>
        </div>
      </div>
    );
}

export default InsufficientFunds;