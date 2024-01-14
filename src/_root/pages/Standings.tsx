import Loader from '@/components/shared/Loader';
import UserCard from '@/components/shared/UserCard';
import { useGetUsers } from '@/lib/react-query/queriesAndMutations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Standings = () => {
    const { ref, inView } = useInView();

    const { data: users, fetchNextPage, hasNextPage } = useGetUsers();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    useEffect(() => {
        if (sessionStorage.getItem('reloadStandings') === '1') {
            sessionStorage.setItem('reloadStandings', '0');
            window.location.reload();
        } else {
            setIsLoading(false);
            sessionStorage.setItem('reloadStandings', '1');
        }
    }, []);

    if (!users)
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );

    const tops = users.pages
        .map((item) => item!.documents)
        .sort((a: any, b: any) => b.xp - a.xp)
        .flat()
        .filter((_user, index) => index < 3);

    tops.push(tops.shift());
    const lastUser = tops.pop();
    tops.splice(1, 0, lastUser);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );
    } else {
        return (
            <div className='flex flex-col items-center w-full max-w-5xl py-14'>
                <div className='flex flex-1 flex-col gap-9 w-full'>
                    <div className='flex-start gap-3 justify-start w-full'>
                        <FontAwesomeIcon
                            icon={['fas', 'medal']}
                            className='fa-2xl text-light-3'
                        />
                        <h2 className='h3-bold md:h2-bold text-left w-full'>
                            Classement
                        </h2>
                    </div>
                </div>
                <ul className='grid-container mt-14'>
                    {tops.map((user: any, index: number) => (
                        <li
                            key={index}
                            className='relative w-full max-w-full h-96 max-h-96'
                        >
                            <UserCard user={user} index={index} />
                            <h1
                                className={`font-bold text-center text-2xl mt-3 rounded-full text-dark-1 ${
                                    index === 0
                                        ? 'bg-silver'
                                        : index === 1
                                        ? 'bg-yellow p-2'
                                        : 'bg-brown'
                                }`}
                            >
                                {index === 0 ? '2' : index === 1 ? '1' : '3'}
                            </h1>
                        </li>
                    ))}
                </ul>
                <ul className='mt-12 w-full'>
                    {users.pages
                        .filter((page) => page.documents.length > 0)
                        .map((item) =>
                            item.documents
                                .sort((a: any, b: any) => b.xp - a.xp)
                                .slice(3)
                                .map((user: any, index: number) => (
                                    <li
                                        key={index + 3}
                                        className='relative w-full h-full mt-8'
                                    >
                                        <UserCard
                                            user={user}
                                            index={index + 3}
                                        />
                                    </li>
                                ))
                        )}
                </ul>
                {hasNextPage && (
                    <div
                        ref={ref}
                        className='flex justify-center items-center w-full h-96'
                    >
                        <Loader />
                    </div>
                )}
            </div>
        );
    }
};

export default Standings;
