import TrainingForm from '@/components/forms/TrainingForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

const CreateTraining = () => {
    useEffect(() => {
        localStorage.setItem('firstLoadDone', '-1');
    }, []);

    return (
        <div className='flex flex-1 px-96'>
            <div className='common-container'>
                <div className='max-w-5x1 flex-start gap-3 justify-start w-full'>
                    <FontAwesomeIcon
                        icon={['fas', 'dumbbell']}
                        className='fa-2xl text-light-3'
                    />
                    <h2 className='h3-bold md:h2-bold text-left w-full'>
                        Ajouter un entraînement
                    </h2>
                </div>

                <TrainingForm action='Ajouter' />
            </div>
        </div>
    );
};

export default CreateTraining;
