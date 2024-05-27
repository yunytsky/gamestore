import logo from "../assets/logo.svg";
import cartIcon from "../assets/cart.svg";
import profileIcon from "../assets/profile.svg";
import settingsIcon from "../assets/settings.svg";
import logoutIcon from "../assets/log-out.svg"
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserCart, logout } from "../api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Header = () => {
    const navigate = useNavigate();

    const [userDropdownVisible, setUserDropdownVisible] = useState(false);
    const userDropdownRef = useRef(null);
    const userDropdownButtonRef = useRef(null);

    const {user, setUser} = useContext(AuthContext);
    const {cartAmnt} = useContext(CartContext);


    const handleLogout = async () => {
      try {
        const config = {withCredentials: true}
        const res = await logout(config);
        console.log(res)
        localStorage.removeItem("user");
        setUser(null);
        setUserDropdownVisible(false);
      } catch (error) {
        console.log(error);
      }
    }

    //Hide popup-form/dropdown-menu when clicked elsewhere
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          userDropdownRef.current !== null &&
          !userDropdownRef.current.contains(event.target) &&
          userDropdownButtonRef.current !== null &&
          !userDropdownButtonRef.current.contains(event.target)
        ) {
          setUserDropdownVisible(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    
    return (
      <header className="header">
        <Link to={"/store"} className="header-logo logo">
          <img src={logo} alt="gamestore logo" />
        </Link>
        <nav className="header-nav">
          {user && (
            <div className="header-nav-left">
              <Link to={"/store"} className="header-nav-element header-link">
                Store
              </Link>
              <Link to={"/library"} className="header-nav-element header-link">
                Library
              </Link>
            </div>
          )}

          <div className="header-nav-right">
            {user ? (
              <>
                {" "}
                <Link
                  to={"/cart"}
                  className="header-nav-element header-link header-cart"
                >
                  <img src={cartIcon} alt="cart icon" className="cart-icon" />
                  <span>Cart</span>
                  <div className="header-cart-items-amnt">{cartAmnt}</div>
                </Link>
                <div className="header-nav-element header-balance">
                  Balance: ${user.balance.toFixed(2)}
                </div>
                <button
                  className="header-nav-element header-user"
                  ref={userDropdownButtonRef}
                  onClick={() => {
                    setUserDropdownVisible((prevVisible) => !prevVisible);
                  }}
                >
                  {user.username}
                </button>
              </>
            ) : (
              <>
                {" "}
                <Link
                  to={"/log-in"}
                  className="header-nav-element header-link"
                >
                  Log in
                </Link>
                <Link
                  to={"/sign-up"}
                  className="header-nav-element header-link"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          {userDropdownVisible && (
            <div className="header-user-dropdown" ref={userDropdownRef}>
              <div className="header-user-dropdown-options">
                <div
                  className="header-user-dropdown-option"
                  onClick={() => {
                    navigate("/profile");
                    setUserDropdownVisible(false);
                  }}
                >
                  <img src={profileIcon} alt="profile" />
                  <span>Profile</span>
                </div>
                <div
                  className="header-user-dropdown-option"
                  onClick={() => {
                    setUserDropdownVisible(false);
                  }}
                >
                  <img src={settingsIcon} alt="logout" />
                  <span>Settings</span>
                </div>
                <div
                  className="header-user-dropdown-option"
                  onClick={handleLogout}
                >
                  <img src={logoutIcon} alt="logout" />
                  <span>Log out</span>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    );
}

export default Header;