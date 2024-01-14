import {
    useDeleteTraining,
    useUpdateUserXp,
} from '@/lib/react-query/queriesAndMutations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Models } from 'appwrite';
import { useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { baseXpByLevel, xpByLevelMultiplier } from '@/constants';
import { useUserContext } from '@/context/AuthContext';
import TrainingLikes from './TrainingLikes';

type Props = {
    training: Models.Document;
    user: Models.Document;
};

export const HistoryCard = ({ training, user }: Props) => {
    const { mutateAsync: deleteTraining } = useDeleteTraining();

    const { mutateAsync: updateUserXp } = useUpdateUserXp();

    const [isModalOpened, setIsModalOpened] = useState(false);

    const { user: currentUser } = useUserContext();

    const xpToNextLevel = (level: number): number => {
        if (level <= 0) {
            return baseXpByLevel;
        }
        return Math.round(xpToNextLevel(level - 1) * xpByLevelMultiplier);
    };

    const levelFromXp = (xp: number): number => {
        let currentLevel = 0;
        let xpToReachNextLevel = 0;

        while (xp >= xpToReachNextLevel) {
            xpToReachNextLevel = xpToNextLevel(currentLevel);
            xp -= xpToReachNextLevel;
            currentLevel++;
        }

        if (xp >= 0) {
            currentLevel++;
        }

        return currentLevel - 1;
    };

    function closeModal() {
        setIsModalOpened(false);
    }

    function deleteTrainingFromId() {
        deleteTraining({ trainingId: training.$id });

        updateUserXp({
            userId: currentUser.id,
            userXp: currentUser.xp - training.xp,
            userLevel: levelFromXp(currentUser.xp - training.xp),
        });
        closeModal();

        setTimeout(() => {
            window.location.reload();
        }, 100);
    }

    return (
        <>
            <Modal
                isOpen={isModalOpened}
                ariaHideApp={false}
                onRequestClose={closeModal}
                className='Modal bg-dark-4'
                overlayClassName='Overlay'
            >
                <div className='flex flex-col justify-center items-center h-full gap-9'>
                    <div className='flex flex-col text-center'>
                        <h2 className='h3-bold md:h2-bold'>
                            Supprimer un entraînement
                        </h2>
                        <p className='small-medium md:base-regular mt-2'>
                            Êtes-vous sûr de vouloir supprimer cet entraînement
                            ?
                        </p>
                    </div>

                    <div className='flex gap-24'>
                        <button
                            className='hover:opacity-65'
                            onClick={closeModal}
                        >
                            Annuler
                        </button>
                        <button
                            className='bg-primary-500 px-5 py-3 rounded-full hover:opacity-65 transition'
                            onClick={deleteTrainingFromId}
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </Modal>
            <div className='bg-dark-3 flex justify-between items-center gap-9 w-full px-12 py-8 rounded-2xl'>
                <div className='flex gap-16 items-center w-full'>
                    <h2 className='h3-bold md:h3-bold text-left whitespace-nowrap'>
                        {training.name}
                    </h2>
                    <div className='flex flex-col items-center'>
                        <p className='text-start text-xl font-bold text-yellow whitespace-nowrap'>
                            + {training.xp} XP
                        </p>
                        <p className='text-left text-md opacity-50 whitespace-nowrap'>
                            {moment(training.date).format('DD/MM/YYYY')}
                        </p>
                    </div>
                    <div className='w-full flex'>
                        <p className='text-left text-xl whitespace-nowrap'>
                            {training.value}
                            {(() => {
                                switch (training.name) {
                                    case 'Marche / Course à pied':
                                        return ' km';
                                    case 'Vélo':
                                        return ' km';
                                    default:
                                        return ' h';
                                }
                            })()}
                        </p>
                    </div>
                </div>
                <hr className='border w-full border-dark-4/80' />
                <TrainingLikes training={training} user={user} />
                {user?.$id === currentUser.id && (
                    <div className='flex gap-2 items-center'>
                        <NavLink
                            to={'/update/' + training.$id}
                            className='flex gap-4 items-center p-4'
                        >
                            <FontAwesomeIcon
                                icon={['fas', 'pen-to-square']}
                                className='fa-xl opacity-20 hover:opacity-100 cursor-pointer transition'
                            />
                        </NavLink>
                        <FontAwesomeIcon
                            icon={['fas', 'ban']}
                            className='fa-xl text-light-3 opacity-20 hover:opacity-100 cursor-pointer transition'
                            onClick={() => setIsModalOpened(true)}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
