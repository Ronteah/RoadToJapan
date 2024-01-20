import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HistoryCard } from './HistoryCard';
import { useGetUsersTrainings } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const UserFollowing = () => {
    const { ref, inView } = useInView();
    const {
        data: trainings,
        fetchNextPage,
        hasNextPage,
    } = useGetUsersTrainings();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    if (!trainings) {
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );
    }
    return (
        <>
            <div className='explore-inner_container'>
                <div className='max-w-5x1 flex-start gap-3 justify-start w-full'>
                    <FontAwesomeIcon
                        icon={['fas', 'user-group']}
                        className='fa-2xl text-light-3'
                    />
                    <h2 className='h3-bold md:h2-bold text-left w-full'>
                        Abonnements
                    </h2>
                </div>
            </div>
            {trainings.pages.length === 0 ? (
                <div className='flex justify-center items-center w-full h-32'>
                    Aucune des personnes que vous suivez n'a encore complété
                    d'entraînement
                </div>
            ) : (
                <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
                    <ul className='w-full'>
                        {trainings.pages.map((item) =>
                            item.documents.map(
                                (training: any, index: number) => (
                                    <li
                                        key={index + 3}
                                        className='relative w-full flex my-12 flex-col justify-center items-center'
                                    >
                                        <div className='flex items-center justify-start w-full pb-5 gap-5'>
                                            <Link
                                                to={`/profile/${training.creator.$id}`}
                                            >
                                                <img
                                                    src={
                                                        training.creator
                                                            .imageUrl
                                                    }
                                                    alt='avatar'
                                                    className='w-12 h-12 rounded-full'
                                                />
                                            </Link>
                                            <h3 className='body-bold md:h3-bold text-start'>
                                                <Link
                                                    to={`/profile/${training.creator.$id}`}
                                                    className='hover:underline'
                                                >
                                                    {training.creator.name}
                                                </Link>{' '}
                                                a complété un entrainement
                                            </h3>
                                        </div>
                                        <HistoryCard
                                            training={training}
                                            user={training.creator}
                                        />
                                    </li>
                                )
                            )
                        )}
                    </ul>
                </div>
            )}
            {hasNextPage && (
                <div
                    ref={ref}
                    className='flex justify-center items-center w-full h-96'
                >
                    <Loader />
                </div>
            )}
        </>
    );
};

export default UserFollowing;
