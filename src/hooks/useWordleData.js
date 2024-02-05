import { useCallback, useContext, useState } from 'react';
import { ApiContext } from '../contexts/api/apiContext';
import { getErrMsg } from './errorParser';

export function useWordleData() {
    const [gameSeriesStarted, setGameSeriesStarted] = useState(false);
    const [gameSeriesOver, setGameSeriesOver] = useState(false);

    const [currentStatus, setCurrentStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { axiosWordlePrivate } = useContext(ApiContext);

    const registerIfNotRegistered = useCallback(
        async function () {
            try {
                setLoading(true);
                setError('');
                const registerStatusRes = await axiosWordlePrivate.get('/register-status');
                const { registered, launched, finished } = registerStatusRes.data;

                setGameSeriesStarted(launched);
                setGameSeriesOver(finished);

                if (!finished && !registered) {
                    await axiosWordlePrivate.post('/register');
                }

            } catch (error) {
                setError(getErrMsg(error));
            } finally {
                setLoading(false);
            }
        },
        [axiosWordlePrivate]
    );

    const getCurrentStatus = useCallback(
        async function () {
            try {
                setLoading(true);
                setError('');
                await registerIfNotRegistered();
                const response = await axiosWordlePrivate.get('/current-status');
                setCurrentStatus(response.data);
            } catch (error) {
                setError(getErrMsg(error));
            } finally {
                setLoading(false);
            }
        },
        [axiosWordlePrivate]
    );

    return {
        currentStatus,
        gameSeriesStarted,
        gameSeriesOver,
        loading,
        error,
        getCurrentStatus
    };
}
