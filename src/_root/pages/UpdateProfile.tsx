import ProfileForm from '@/components/forms/ProfileForm';
import { useUserContext } from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const { user } = useUserContext();

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('firstLoadDone')) {
            localStorage.setItem('firstLoadDone', '1');
        } else {
            localStorage.setItem('firstLoadDone', '');
            navigate(-1);
        }
    }, []);

    return (
        <div className='flex flex-1 flex-col px-96 py-10'>
            <div className='max-w-5x1 flex-start gap-3 justify-start w-full'>
                <FontAwesomeIcon
                    icon={['fas', 'user']}
                    className='fa-2xl text-light-3'
                />
                <h2 className='h3-bold md:h2-bold text-left w-full'>
                    Modifier Profil
                </h2>
            </div>
            <ProfileForm user={user} />
        </div>
    );
};

export default UpdateProfile;
