import "./Home.css";
import rightArrow from "../../assets/rightArrow.png";
import leaderboard from "../../assets/leaderboard.png";

export default function Home() {
    const backLink = process.env.REACT_APP_PLAY_MAIN_SITE_URL || "https://play.excelmec.org";
    return (
        <div className="home">
            <h1>Welcome to the Wordle</h1>
            <h2>
                Get 5 chances to guess the word!
            </h2>
            <a className="home-btn" href="/game">
                <span>
                    Play Now!
                </span>
                <img className="home-btn-icon" src={rightArrow} alt="right arrow" />
            </a>
            <a className="home-btn" href="/leaderboard">
                <span>
                    Leaderboard
                </span>
                <img className="home-btn-icon" src={leaderboard} alt="leaderboard" />

            </a>

            <a className="home-btn back-btn" href={backLink} target="_top">
                <img className="home-btn-icon flipX" src={rightArrow} alt="back" />
                <span>
                    {"Back to all games"}
                </span>

            </a>
        </div>
    );
}