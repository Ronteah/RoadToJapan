import { Models } from 'appwrite';
import { HistoryCard } from './HistoryCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';
import moment from 'moment';

type Props = {
    user: Models.Document;
};

const History = ({ user }: Props) => {
    const { user: currentUser } = useUserContext();

    const trainings = user.trainings;

    if (trainings.length === 0 && user.$id === currentUser.id)
        return (
            <div className='w-full flex flex-col items-center gap-4 mb-24 pt-10'>
                <div className='max-w-5x1 flex-start gap-3 justify-start w-full my-5'>
                    <FontAwesomeIcon
                        icon={['fas', 'dumbbell']}
                        className='fa-2xl text-light-3'
                    />
                    <h2 className='h3-bold md:h2-bold text-left w-full'>
                        Entraînements
                    </h2>
                </div>
                <div className='bg-dark-2 flex flex-col items-center gap-5 w-full py-12 rounded-2xl'>
                    <p className='opacity-50'>
                        Vous n'avez pas encore d'entraînements.
                    </p>
                    <Link
                        to={'/create'}
                        className='flex gap-4 items-center justify-center bg-dark-4 w-80 hover:bg-primary-500 rounded-full p-4 transition'
                    >
                        <FontAwesomeIcon
                            icon={['fas', 'add']}
                            className='group-hover:invert-white transition'
                        />
                        Ajouter un entraînement
                    </Link>
                </div>
            </div>
        );

    if (trainings.length === 0 && user.$id !== currentUser.id)
        return (
            <div className='w-full flex flex-col items-center gap-4 mb-24 pt-10'>
                <div className='max-w-5x1 flex-start gap-3 justify-start w-full my-5'>
                    <FontAwesomeIcon
                        icon={['fas', 'dumbbell']}
                        className='fa-2xl text-light-3'
                    />
                    <h2 className='h3-bold md:h2-bold text-left w-full'>
                        Entraînements
                    </h2>
                </div>
                <div className='bg-dark-2 flex flex-col items-center gap-5 w-full py-12 rounded-2xl'>
                    <p className='opacity-50'>
                        {user.name} n'a pas encore d'entraînements.
                    </p>
                </div>
            </div>
        );

    return (
        <div className='w-full flex flex-col gap-4 mb-24 pt-10'>
            <div className='max-w-5x1 flex-start gap-3 justify-start w-full my-5'>
                <FontAwesomeIcon
                    icon={['fas', 'dumbbell']}
                    className='fa-2xl text-light-3'
                />
                <h2 className='h3-bold md:h2-bold text-left w-full'>
                    Entraînements ({trainings.length})
                </h2>
            </div>
            <ul className='flex flex-col flex-1 gap-9 w-full'>
                {trainings
                    .sort(
                        (a: any, b: any) =>
                            moment(b.date).valueOf() - moment(a.date).valueOf()
                    )
                    .map((training: Models.Document, index: number) => (
                        <HistoryCard
                            key={training.name + index}
                            user={user!}
                            training={training}
                        />
                    ))}
            </ul>
        </div>
    );
};

export default History;
