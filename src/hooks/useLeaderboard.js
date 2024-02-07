import { useCallback, useContext, useState } from "react";
import { ApiContext } from "../contexts/api/apiContext";
import { getErrMsg } from "./errorParser";

export function useLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { axiosWordlePublic } = useContext(ApiContext);

    const fetchLeaderboard = useCallback(async function () {
        try {
            const response = await axiosWordlePublic.get("/leaderboard");
            const data = response.data;
            console.log(data);
            setLeaderboard(data);
        } catch (err) {
            setError(getErrMsg(err));
        } finally {
            setLoading(false);
        }
    }, [axiosWordlePublic]);

    return {
        leaderboard,
        loading,
        error,
        fetchLeaderboard,
    }
}