import Loader from '@/components/shared/Loader';
import UserFollowing from '@/components/shared/UserFollowing';
import UserOverview from '@/components/shared/UserOverview';
import { useUserContext } from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user: currentUser, isLoading: isUserLoading } = useUserContext();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (sessionStorage.getItem('reloadHome') === '1') {
            sessionStorage.setItem('reloadHome', '0');
            window.location.reload();
        } else {
            setIsLoading(false);
            sessionStorage.setItem('reloadHome', '1');
        }
    }, []);

    if (isUserLoading || isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );
    }

    return (
        <div className='explore-container'>
            <h1 className='font-bold text-4xl text-start w-full max-w-5xl flex items-center gap-5 mb-14 mt-5'>
                Bonjour {currentUser.name} ! 👋
                <Link
                    to={'/create'}
                    className='bg-dark-4 px-5 py-3 rounded-full hover:bg-primary-500 transition text-base font-normal'
                >
                    <FontAwesomeIcon icon={['fas', 'add']} className='mr-2' />
                    Ajouter un entraînement
                </Link>
            </h1>
            <div className='explore-inner_container'>
                <div className='max-w-5x1 flex-start gap-3 justify-start w-full'>
                    <FontAwesomeIcon
                        icon={['fas', 'eye']}
                        className='fa-2xl text-light-3'
                    />
                    <h2 className='h3-bold md:h2-bold text-left w-full'>
                        Votre aperçu
                    </h2>
                </div>
            </div>
            <UserOverview userId={currentUser.id} />
            <UserFollowing />
        </div>
    );
};

export default Home;
