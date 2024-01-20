import { useGetUserById } from '@/lib/react-query/queriesAndMutations';
import Loader from './Loader';
import { Link } from 'react-router-dom';

type Props = {
    userId: string;
};

const UserOverview = ({ userId }: Props) => {
    const { data: user, isPending } = useGetUserById(userId || '');

    function getTotalXPGainedThisWeek(trainings: any[]): number {
        return trainings.reduce((acc: number, training: any) => {
            const date = new Date(training.date);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 7) {
                return acc + training.xp;
            } else {
                return acc;
            }
        }, 0);
    }

    if (isPending || !user) {
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );
    } else {
        const xpThisWeek =
            user.trainings.length === 0
                ? 0
                : getTotalXPGainedThisWeek(user.trainings);

        return (
            <div className='flex items-center justify-start gap-9 w-full max-w-5xl mt-5 mb-12 py-5'>
                <div className='min-w-52 h-52 flex flex-col justify-center items-center gap-2 rounded-2xl bg-dark-3'>
                    <h2 className='text-5xl font-bold'>
                        {user.trainings.length}
                    </h2>
                    <p className='text-center'>
                        entraînements
                        <br />
                        complétés
                    </p>
                </div>
                <div className='min-w-52 h-52 flex flex-col justify-center items-center gap-2 rounded-2xl bg-dark-3'>
                    <h2 className='text-4xl font-bold text-yellow'>
                        +{xpThisWeek} XP
                    </h2>
                    <p className='text-center'>cette semaine</p>
                </div>
                <div className='w-full h-52 flex flex-col justify-center items-center gap-2 rounded-2xl bg-dark-3'>
                    <p className='text-center opacity-35'>
                        Vous ne participez à aucun challenge.
                    </p>
                    <Link
                        to={''}
                        className='bg-dark-4 px-5 py-3 rounded-full hover:opacity-65 transition'
                    >
                        Créer un challenge
                    </Link>
                </div>
            </div>
        );
    }
};

export default UserOverview;
