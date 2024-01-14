import { useUserContext } from '@/context/AuthContext';
import { useUpdateUserFollow } from '@/lib/react-query/queriesAndMutations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import { toast } from '../ui/use-toast';

type Props = {
    user: Models.Document;
    index?: number;
};

const UserCard = ({ user, index }: Props) => {
    const { mutateAsync: updateUser } = useUpdateUserFollow();
    const { user: currentUser } = useUserContext();

    const handleFollow = async (user: Models.Document) => {
        user.followers = user.followers || [];
        currentUser.following = currentUser.following || [];

        if (user.followers && user.followers.includes(currentUser.id)) {
            user.followers.splice(user.followers.indexOf(currentUser.id), 1);
        } else {
            user.followers.push(currentUser.id);
        }

        const updateUserFollow = await updateUser({
            userId: user.$id,
            userFollowers: user.followers,
            userFollowing: user.following,
        });

        if (!updateUserFollow) {
            return toast({
                title: 'Veuillez réessayez.',
            });
        }

        if (user.followers && user.followers.includes(currentUser.id)) {
            currentUser.following.push(user.$id);
        } else {
            currentUser.following.splice(
                currentUser.following.indexOf(user.$id),
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

    const currentIsUser = currentUser.id === user.$id;

    if (index! > 2) {
        return (
            <Link
                to={`/profile/${user.$id}`}
                className={`flex justify-between pr-11 items-center w-full rounded-2xl bg-dark-3 hover:bg-dark-4 transition ${
                    currentIsUser && 'cardIsUser'
                }`}
            >
                <img
                    src={user.imageUrl}
                    alt='user'
                    className='w-32 h-32 rounded-l-2xl object-cover'
                />
                <div className='w-full flex items-center justify-around'>
                    <div className='flex flex-col items-center'>
                        <h3 className='font-bold text-xl'>TOP</h3>
                        <h1 className='font-bold text-3xl'>{index! + 1}</h1>
                    </div>
                    <div className='flex flex-col items-center'>
                        <p className='opacity-35 whitespace-nowrap'>
                            Niveau {user.level}
                        </p>
                        <p className='text-yellow font-bold text-xl whitespace-nowrap'>
                            {user.xp} XP
                        </p>
                    </div>
                </div>
                <hr className='border w-full border-dark-4/80' />
                <div className='flex flex-col w-full items-center justify-center'>
                    <h3 className='h3-bold w-full text-end truncate'>
                        {user.name}
                    </h3>
                    <p className='text-primary-500 w-full text-end truncate'>
                        @{user.username}
                    </p>
                </div>
                {!currentIsUser && (
                    <div
                        className={
                            'w-11 h-11 aspect-square ml-11 flex justify-center items-center rounded-full transition ' +
                            (user!.followers &&
                            user!.followers.includes(currentUser.id)
                                ? 'bg-primary-500 hover:bg-dark-2'
                                : 'bg-dark-2 hover:bg-primary-500')
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFollow(user);
                        }}
                    >
                        {user!.followers &&
                        user!.followers.includes(currentUser.id) ? (
                            <FontAwesomeIcon
                                icon={['fas', 'check']}
                                className='fa-lg'
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={['fas', 'add']}
                                className='fa-lg'
                            />
                        )}
                    </div>
                )}
            </Link>
        );
    } else {
        return (
            <Link
                to={`/profile/${user.$id}`}
                className={`grid-post_link ${currentIsUser && 'cardIsUser'} ${
                    index !== 1 && 'mt-4'
                }`}
            >
                {!currentIsUser && (
                    <div
                        className={`absolute top-2 right-2 w-11 h-11 flex justify-center items-center rounded-full transition ${
                            index !== 1 && 'mt-4'
                        }
                            ${
                                user!.followers &&
                                user!.followers.includes(currentUser.id)
                                    ? 'bg-primary-500 hover:bg-dark-3'
                                    : 'bg-dark-3 hover:bg-primary-500'
                            }`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFollow(user);
                        }}
                    >
                        {user!.followers &&
                        user!.followers.includes(currentUser.id) ? (
                            <FontAwesomeIcon
                                icon={['fas', 'check']}
                                className='fa-lg'
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={['fas', 'add']}
                                className='fa-lg'
                            />
                        )}
                    </div>
                )}
                <img
                    src={user.imageUrl}
                    alt='user'
                    className='w-full h-72 object-cover'
                />
                <div className='flex justify-between items-center h-20 px-8'>
                    <div>
                        <h3 className='h3-bold text-left w-44 truncate'>
                            {user.name}
                        </h3>
                        <p className='text-primary-500 w-44 truncate'>
                            @{user.username}
                        </p>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <p className='opacity-35 whitespace-nowrap'>
                            Niveau {user.level}
                        </p>
                        <p className='text-yellow font-bold text-xl whitespace-nowrap'>
                            {user.xp} XP
                        </p>
                    </div>
                </div>
            </Link>
        );
    }
};

export default UserCard;
