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
        <a href="/">
          <h1>Wordle</h1>
        </a>
        <a className="how-to-play-link" href="/how-to-play"> How to play? </a>
        <div className="spacer"></div>
        <span>Loading...</span>
      </nav>
    );
  }

  if (userError) {
    console.log(userError);
    return (
      <nav>
        <a href="/">
          <h1>Wordle</h1>
        </a>
        <a className="how-to-play-link" href="/how-to-play"> How to play? </a>
        <div className="spacer"></div>
        <span>Error</span>
      </nav>
    );
  }

  if (!userData.loggedIn) {
    return (
      <nav>
        <a href="/">
          <h1>Wordle</h1>
        </a>
        <a className="how-to-play-link" href="/how-to-play"> How to play? </a>
        <div className="spacer"></div>
        <a href={loginUrl} className="login-btn">Login</a>
      </nav>
    );
  }


  return (
    <nav>
      <a href="/">
        <h1>Wordle</h1>
      </a>
      <a className="how-to-play-link" href="/how-to-play"> How to play? </a>
      <div className="spacer"></div>
      <img 
        onClick={logout}
        className="avatar"
        src={userData.profilePictureUrl}
        alt={userData.name}
        referrerPolicy="no-referrer"
      />
    </nav>
  )
}