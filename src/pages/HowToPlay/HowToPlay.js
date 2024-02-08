import "./HowToPlay.css";
import example from "../../assets/example.png";

export default function HowToPlay() {
    return (
        <div className="how-to-play">
            <h1>How to play</h1>
            <h3>Guess the Wordle in 5 tries.</h3>
            <ul>
                <li>Each word must a valid word.</li>
                <li>The number of letters in the word varies each day and is indicated by number of columns.</li>
                <li>For each letter that is correct and in the right position, you will get a green square.</li>
                <li>For each letter that is correct but in the wrong position, you will get a yellow square.</li>
                <li>For each letter that is not in the word, you get a grey square</li>
                <li>You have 5 chances to guess the word.</li>
                <li>Maintain your streak by finding the right word each day!</li>
                <li>Good luck!</li>
            </ul>
            <h3>Example</h3>
            <img src={example} alt="Example" />
        </div>
    )
}