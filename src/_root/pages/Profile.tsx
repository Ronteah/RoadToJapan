import ExperienceBar from '@/components/shared/ExperienceBar';
import History from '@/components/shared/History';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import {
    useDeleteUserAccount,
    useGetUserById,
    useUpdateUserFollow,
} from '@/lib/react-query/queriesAndMutations';
import Loader from '@/components/shared/Loader';
import { IUser } from '@/types';
import { useUserContext } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
    const { id } = useParams();
    const { data: user, isPending } = useGetUserById(id || '');

    const { user: currentUser, isLoading } = useUserContext();

    const { mutateAsync: updateUser } = useUpdateUserFollow();

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('firstLoadDone') === '-1') {
            localStorage.setItem('firstLoadDone', '');
            window.location.reload();
        }

        setTimeout(() => {
            setIsWaiting(false);
        }, 100);
    }, [currentUser]);

    const { mutateAsync: deleteUserAccount } = useDeleteUserAccount();

    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isWaiting, setIsWaiting] = useState(true);

    function closeModal() {
        setIsModalOpened(false);
    }

    function deleteAccount() {
        deleteUserAccount({
            user: user! as unknown as IUser,
            userPassword: 'adminadmin',
        }).then(() => {
            closeModal();
            navigate('/sign-in');
        });
    }

    const handleFollow = async () => {
        user!.followers = user!.followers || [];
        currentUser.following = currentUser.following || [];

        if (user!.followers && user!.followers.includes(currentUser.id)) {
            user!.followers.splice(user!.followers.indexOf(currentUser.id), 1);
        } else {
            user!.followers.push(currentUser.id);
        }

        const updateUserFollow = await updateUser({
            userId: user!.$id,
            userFollowers: user!.followers,
            userFollowing: user!.following,
        });

        if (!updateUserFollow) {
            return toast({
                title: 'Veuillez réessayez.',
            });
        }

        if (user!.followers && user!.followers.includes(currentUser.id)) {
            currentUser.following.push(user!.$id);
        } else {
            currentUser.following.splice(
                currentUser.following.indexOf(user!.$id),
                1
            );
        }

        const updateCurrentUserFollow = await updateUser({
            userId: currentUser.id,
            userFollowers: currentUser.followers,
            userFollowing: currentUser.following,
        });

        if (!updateCurrentUserFollow) {
            return toast({
                title: 'Veuillez réessayez.',
            });
        }
    };

    if (isPending || isWaiting || isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );
    } else {
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
                                Supprimer votre compte
                            </h2>
                            <p className='small-medium md:base-regular mt-2'>
                                Êtes-vous sûr de vouloir supprimer votre compte
                                utilisateur ?
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
                                onClick={deleteAccount}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </Modal>
                <div className='flex flex-col items-center w-full max-w-5xl py-14'>
                    <div className='flex flex-1 flex-col gap-9 w-full'>
                        <div className='flex-start gap-3 justify-start w-full'>
                            <FontAwesomeIcon
                                icon={['fas', 'user']}
                                className='fa-2xl text-light-3'
                            />
                            <h2 className='h3-bold md:h2-bold text-left w-full'>
                                Profil
                            </h2>
                        </div>
                        <div className='flex flex-1 bg-dark-3 px-6 py-6 rounded-full w-full'>
                            <img
                                src={
                                    user?.imageUrl ||
                                    '/assets/images/profile.png'
                                }
                                alt='profile picture'
                                className='h-44 w-44 object-cover rounded-full'
                            />
                            <hr className='border h-full border-dark-4/80 mx-12' />
                            <div className='flex flex-col w-full justify-center gap-9 pb-7'>
                                <div className='flex items-center w-full'>
                                    <div className='w-full'>
                                        <h2
                                            className='h3-bold md:h2-bold flex gap-4 text-left w-52 truncate'
                                            title={user?.name}
                                        >
                                            {user?.name}
                                        </h2>
                                        <p
                                            className='text-left text-xl text-light-3 w-52 truncate'
                                            title={user?.username}
                                        >
                                            @{user?.username}
                                        </p>
                                    </div>
                                    <div className='w-full flex justify-end items-center gap-10 pr-14'>
                                        <div className='flex gap-10 justify-end'>
                                            <p className='text-right w-full whitespace-nowrap'>
                                                {user?.followers.length} Abonnés
                                            </p>
                                            <p className='text-right w-full whitespace-nowrap'>
                                                {user?.following.length}{' '}
                                                Abonnements
                                            </p>
                                        </div>
                                        {user?.$id === currentUser.id ? (
                                            <Link
                                                to={`/update-profile/${user?.id}`}
                                                className='bg-primary-500 hover:opacity-65 w-32 flex justify-center rounded-lg px-4 py-2 transition'
                                            >
                                                <div className='flex items-center gap-3'>
                                                    <FontAwesomeIcon
                                                        icon={['fas', 'pen']}
                                                        className='fa-md'
                                                    />
                                                    Modifier
                                                </div>
                                            </Link>
                                        ) : user!.followers &&
                                          user!.followers.includes(
                                              currentUser.id
                                          ) ? (
                                            <Button
                                                className='flex items-center gap-3 bg-primary-500 hover:opacity-65 w-32 justify-center rounded-lg px-4 py-2 transition'
                                                onClick={handleFollow}
                                            >
                                                <FontAwesomeIcon
                                                    icon={['fas', 'check']}
                                                    className='fa-md'
                                                />
                                                Suivi
                                            </Button>
                                        ) : (
                                            <Button
                                                className='flex items-center gap-3 border-2 border-primary-500 hover:opacity-65 w-32 justify-center rounded-lg px-4 py-2 transition'
                                                onClick={handleFollow}
                                            >
                                                <FontAwesomeIcon
                                                    icon={['fas', 'user-plus']}
                                                    className='fa-md'
                                                />
                                                Suivre
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <ExperienceBar user={user!} />
                            </div>
                        </div>
                    </div>
                    {user?.$id === currentUser.id && (
                        <div className='w-full flex justify-center pt-2'>
                            <Button
                                className='text-primary-500 hover:underline'
                                onClick={() => setIsModalOpened(true)}
                            >
                                Supprimer mon compte
                            </Button>
                        </div>
                    )}
                    <History user={user!} />
                </div>
            </>
        );
    }
};

export default Profile;
