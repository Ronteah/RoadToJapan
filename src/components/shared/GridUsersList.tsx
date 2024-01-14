import { useUserContext } from '@/context/AuthContext';
import { Models } from 'appwrite';
import Loader from './Loader';
import { useState } from 'react';
import UserCard from './UserCard';

type Props = {
    users: Models.Document[];
    allUsers?: boolean;
};

const GridUsersList = ({ users, allUsers }: Props) => {
    const [isLoading, setIsLoading] = useState(true);
    const { user: currentUser } = useUserContext();

    if (!users)
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );

    let filteredUsers = users;

    if (allUsers)
        filteredUsers = users.filter(
            (user) =>
                user.username !== currentUser?.username &&
                !user.followers.includes(currentUser.id)
        );

    if (filteredUsers.length === 0 && isLoading) {
        setTimeout(() => setIsLoading(false), 1000);
        return (
            <div className='flex justify-center items-center w-full h-24'>
                <Loader />
            </div>
        );
    } else if (filteredUsers.length === 0) {
        return (
            <div className='flex justify-center items-center w-full h-24'>
                {allUsers ? (
                    <p className='opacity-35'>
                        Vous suivez déjà tout le monde !
                    </p>
                ) : (
                    <p className='opacity-35'>
                        Vous ne suivez personne pour le moment
                    </p>
                )}
            </div>
        );
    } else {
        return (
            <ul className='grid-container'>
                {filteredUsers.map((user) => (
                    <li
                        key={user.$id}
                        className='relative w-full max-w-full h-96 max-h-96'
                    >
                        <UserCard user={user} />
                    </li>
                ))}
            </ul>
        );
    }
};

export default GridUsersList;
