import { useCallback, useContext, useState } from 'react';
import { ApiContext } from '../contexts/api/apiContext';
import { getErrMsg } from './errorParser';

export function useWordleData() {
    const [currentStatus, setCurrentStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { axiosWordlePrivate } = useContext(ApiContext);

    const getCurrentStatus = useCallback(
        async function () {
            try {
                setLoading(true);
                setError('');
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

    return { currentStatus, loading, error, getCurrentStatus };
}
