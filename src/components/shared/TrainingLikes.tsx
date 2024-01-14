import {
    useUpdateUserLikes,
    useUpdateTrainingLikes,
} from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useUserContext } from '@/context/AuthContext';

type Props = {
    training: Models.Document;
    user: Models.Document;
};

const TrainingLikes = ({ training, user }: Props) => {
    const [isLiked, setIsLiked] = useState(false);
    const [nbLikes, setNbLikes] = useState(training.likes);

    const { mutateAsync: updateUserLikes } = useUpdateUserLikes();
    const { mutateAsync: updateTrainingLikes } = useUpdateTrainingLikes();

    const { user: currentUser } = useUserContext();

    useEffect(() => {
        setIsLiked(currentUser.trainingsLiked?.includes(training.$id));
    }, [currentUser]);

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (user?.$id !== currentUser.id) {
            if (!currentUser.trainingsLiked.includes(training.$id)) {
                updateTrainingLikes({
                    trainingId: training.$id,
                    trainingLikes: training.likes + 1,
                });

                updateUserLikes({
                    userId: currentUser.id,
                    userTrainingsLiked: [
                        ...currentUser.trainingsLiked,
                        training.$id,
                    ],
                });
            } else {
                updateTrainingLikes({
                    trainingId: training.$id,
                    trainingLikes: training.likes - 1,
                });

                updateUserLikes({
                    userId: currentUser.id,
                    userTrainingsLiked: currentUser.trainingsLiked.filter(
                        (trainingLiked: string) =>
                            trainingLiked !== training.$id
                    ),
                });
            }
        }
    };

    return (
        <>
            {user?.$id !== currentUser.id ? (
                <div className='flex gap-3 items-center text-start w-24 justify-start'>
                    {isLiked ? (
                        <>
                            <FontAwesomeIcon
                                icon={['fas', 'thumbs-up']}
                                className='fa-2xl text-primary-500 cursor-pointer transition hover:text-white'
                                onClick={(e) => {
                                    setIsLiked(false);
                                    setNbLikes(nbLikes - 1);
                                    handleLike(e);
                                }}
                            />
                            <p className='opacity-35'>{nbLikes}</p>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon
                                icon={['fas', 'thumbs-up']}
                                className='fa-2xl opacity-35 cursor-pointer transition hover:opacity-100'
                                onClick={(e) => {
                                    setIsLiked(true);
                                    setNbLikes(nbLikes + 1);
                                    handleLike(e);
                                }}
                            />
                            <p className='opacity-35'>{nbLikes}</p>
                        </>
                    )}
                </div>
            ) : (
                <div className='flex gap-3 items-center opacity-35'>
                    <FontAwesomeIcon
                        icon={['fas', 'thumbs-up']}
                        className='fa-2xl'
                    />
                    <p>{training.likes}</p>
                </div>
            )}
        </>
    );
};

export default TrainingLikes;
