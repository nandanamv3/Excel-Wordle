import "./Navbar.css";
import UserContext from '../../contexts/user/userContext';
import { useContext } from "react";
import { getLoginUrl } from "../../utils/getLoginRoute";

export default function Navbar() {
  const { userData, userLoading, userError, logout } = useContext(UserContext);
  const loginUrl = getLoginUrl();

  if (userLoading) {
    return (
      <nav>
        <h1>Wordle</h1>
        <span>Loading...</span>
      </nav>
    );
  }

  if (userError) {
    console.log(userError);
    return (
      <nav>
        <h1>Wordle</h1>
        <span>Error</span>
      </nav>
    );
  }

  if (!userData.loggedIn) {
    return (
      <nav>
        <h1>Wordle</h1>
        <a href={loginUrl} className="login-btn">Login</a>
      </nav>
    );
  }


  return (
    <nav>
      <a href="/">
        <h1>Wordle</h1>
      </a>
      <img onClick={logout} className="avatar" src={userData.profilePictureUrl} alt={userData.name} />
    </nav>
  )
}