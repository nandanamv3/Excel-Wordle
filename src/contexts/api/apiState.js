import { useCallback, useEffect } from 'react';
import { ApiContext } from './apiContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import axios from 'axios';

const accBaseUrl = process.env.REACT_APP_ACC_BACKEND_BASE_URL;
const wordleBaseUrl = process.env.REACT_APP_WORDLE_BACKEND_BASE_URL;

export function ApiState({ children }) {

    if (!accBaseUrl) {
        throw new Error('REACT_APP_ACC_BACKEND_BASE_URL is undefined');
    }
    if (!wordleBaseUrl) {
        throw new Error('REACT_APP_WORDLE_BACKEND_BASE_URL is undefined');
    }
    if (!process.env.REACT_APP_AUTH_REDIR_URL) {
        throw new Error('REACT_APP_AUTH_REDIR_URL is undefined');
    }

    const [refreshToken, setRefreshToken] = useLocalStorage('refreshToken', '');
    const [accessToken, setAccessToken] = useLocalStorage('accessToken', '');

    function checkRefreshFromUrl() {
        const currUrl = new URL(window.location.href);
        let newRefreshToken = currUrl.searchParams.get('refreshToken');
        if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
            currUrl.searchParams.delete('refreshToken');
            window.history.replaceState({}, '', currUrl.toString());
        }
    }

    useEffect(() => {
        checkRefreshFromUrl();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log('Refresh token in state', refreshToken);
    console.log('Access token in state', accessToken);

    const axiosConfig = {
        timeout: 20000,
        headers: {
            'Content-type': 'application/json',
        },
    };

    //Axios with Access Token
    const axiosAccPrivate = axios.create({
        ...axiosConfig,
        baseURL: accBaseUrl,
    });

    //Axios without Access Token
    const axiosAccPublic = axios.create({
        ...axiosConfig,
        baseURL: accBaseUrl,
    });

    //Axios with Access Token
    const axiosWordlePrivate = axios.create({
        ...axiosConfig,
        baseURL: wordleBaseUrl,
    });

    //Axios without Access Token
    const axiosWordlePublic = axios.create({
        ...axiosConfig,
        baseURL: wordleBaseUrl,
    });

    async function refreshTheAccessToken() {
        if (!refreshToken) {
            return '';
        }

        const response = await axiosAccPublic.post(
            '/api/Auth/refresh',
            JSON.stringify({ refreshToken: refreshToken })
        );

        const { accessToken } = response.data;
        setAccessToken(accessToken);
        return accessToken;
    }
    const refreshAccessToken = useCallback(refreshTheAccessToken, [
        refreshToken,
        axiosAccPublic,
        setAccessToken,
    ]);

    useEffect(() => {
        refreshAccessToken();
    }, [refreshToken, axiosAccPublic, setAccessToken, refreshAccessToken]);

    const attachAccessToken = (config) => {
        if (accessToken && accessToken.length > 0) {
            config.headers['Authorization'] = 'Bearer ' + accessToken;
            return config;
        } else {
            //Clear authorization
            config.headers['Authorization'] = '';
        }
        return config;
    };

    axiosAccPrivate.interceptors.request.clear();
    axiosWordlePrivate.interceptors.request.clear();

    /**
     * Attach Access Token to every request
     */
    axiosAccPrivate.interceptors.request.use(attachAccessToken);
    axiosWordlePrivate.interceptors.request.use(attachAccessToken);

    axiosAccPrivate.interceptors.response.clear();
    axiosWordlePrivate.interceptors.response.clear();

    const retryWithAt = [
        (res) => {
            return res;
        },

        async (err) => {
            const originalConfig = err.config;

            if (
                !originalConfig._retry &&
                (err.response?.status === 401 || // For expired token
                    err?.code === 'ECONNABORTED') // For cold start timeouts
            ) {
                console.log('Token Expired, Retrying');
                originalConfig._retry = true;

                try {
                    const newAccessToken = await refreshAccessToken();
                    originalConfig.headers['Authorization'] =
                        'Bearer ' + newAccessToken;

                    return await axios(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
            return Promise.reject(err);
        },
    ];

    /**
     * Refresh Access Token on expiry
     */
    axiosAccPrivate.interceptors.response.use(...retryWithAt);
    axiosWordlePrivate.interceptors.response.use(...retryWithAt);


    const retryWithoutAt = [
        (res) => {
            return res;
        },

        async (err) => {
            const originalConfig = err.config;

            if (
                !originalConfig._retry &&
                err?.code === 'ECONNABORTED') // For cold start timeouts
            {
                console.log('Retrying Coldstart Timeout');
                originalConfig._retry = true;

                try {
                    return await axios(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
            return Promise.reject(err);
        },
    ];

    axiosAccPublic.interceptors.response.clear();
    axiosWordlePublic.interceptors.response.clear();

    axiosAccPublic.interceptors.response.use(...retryWithoutAt);
    axiosWordlePublic.interceptors.response.use(...retryWithoutAt);

    return (
        <ApiContext.Provider
            value={{
                accessToken,
                refreshToken,
                setAccessToken,
                setRefreshToken,

                axiosAccPrivate,
                axiosAccPublic,

                axiosWordlePrivate,
                axiosWordlePublic,
            }}
        >
            {children}
        </ApiContext.Provider>
    );
}
