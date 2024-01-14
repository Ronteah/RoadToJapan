import TrainingForm from '@/components/forms/TrainingForm';
import Loader from '@/components/shared/Loader';
import { useGetTrainingById } from '@/lib/react-query/queriesAndMutations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UpdateTraining = () => {
    const { id } = useParams();
    const { data: training, isPending } = useGetTrainingById(id || '');

    useEffect(() => {
        localStorage.setItem('firstLoadDone', '-1');
    }, []);

    if (isPending)
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );

    return (
        <div className='flex flex-1 px-96'>
            <div className='common-container'>
                <div className='max-w-5x1 flex-start gap-3 justify-start w-full'>
                    <FontAwesomeIcon
                        icon={['fas', 'dumbbell']}
                        className='fa-2xl text-light-3'
                    />
                    <h2 className='h3-bold md:h2-bold text-left w-full'>
                        Modifier un entraînement
                    </h2>
                </div>

                <TrainingForm action='Modifier' training={training} />
            </div>
        </div>
    );
};

export default UpdateTraining;
