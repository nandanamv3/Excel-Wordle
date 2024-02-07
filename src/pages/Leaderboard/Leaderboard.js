import { useEffect } from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import "./Leaderboard.css";

export default function Leaderboard() {
    const { leaderboard, loading, error, fetchLeaderboard } = useLeaderboard();
    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);
    return (
        <div className="leaderboard">
            <h1>Leaderboard</h1>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Streak</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && <tr><td colSpan="5">Loading...</td></tr>}
                    {error && <tr><td colSpan="5">{error}</td></tr>}
                    {leaderboard?.map((entry, index) => {
                        return (

                            <tr key={entry.userId}>
                                <td>{index + 1}</td>
                                <td><img src={entry.profilePicUrl} alt="profile" /></td>
                                <td>{entry.name}</td>
                                <td>{entry.score}</td>
                                <td>{entry.streak}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}