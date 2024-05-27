import errorIcon from "../assets/warning.svg";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
      <div className="not-found error-page">
        <div className="error-name">
          <img src={errorIcon} alt="error icon" />
          <h3>404</h3>
        </div>
        <p className="error-text">
          Page not found.
        </p>
        
        <Link className="error-button button">Go back</Link>
        
      </div>
    );
}

export default NotFound;