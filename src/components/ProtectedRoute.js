import { useContext } from 'react';
import UserContext from '../contexts/user/userContext';

export default function ProtectedRoute(props) {
    const { userData, userLoading, userError } = useContext(UserContext);

    if (userLoading) {
        return <h2 variant='h5'>Loading...</h2>;
    }

    if (userError) {
        return <h2 variant='h3'>{userError}</h2>;
    }

    if (!userData.loggedIn) {
        return <h2 variant='h5'>Login to continue!</h2>;
    }

    return <>{props.children}</>;
}
