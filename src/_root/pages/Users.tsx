import GridUsersList from '@/components/shared/GridUsersList';
import Loader from '@/components/shared/Loader';
import SearchResults from '@/components/shared/SearchResults';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/context/AuthContext';
import useDebounce from '@/hooks/useDebounce';
import {
    useGetUsers,
    useSearchUsers,
} from '@/lib/react-query/queriesAndMutations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Users = () => {
    const { ref, inView } = useInView();

    const { data: users, fetchNextPage, hasNextPage } = useGetUsers();

    const { user: currentUser } = useUserContext();

    const [isLoading, setIsLoading] = useState(true);

    const [searchValue, setSearchValue] = useState('');
    const debouncedSearch = useDebounce(searchValue, 500);
    const { data: searchedUsers, isFetching: isSearchFetching } =
        useSearchUsers(debouncedSearch);

    useEffect(() => {
        if (inView && !searchValue) {
            fetchNextPage();
        }
        localStorage.setItem('firstLoadDone', '-1');
    }, [inView, searchValue]);

    useEffect(() => {
        if (sessionStorage.getItem('reloadUsers') === '1') {
            sessionStorage.setItem('reloadUsers', '0');
            window.location.reload();
        } else {
            setIsLoading(false);
            sessionStorage.setItem('reloadUsers', '1');
        }
    }, []);

    if (!users)
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );

    const shouldShowSearchResults = searchValue !== '';
    const shouldShowUsers =
        !shouldShowSearchResults &&
        users!.pages.every((item) => item!.documents.length === 0);

    const followingUsers = users.pages
        .map((item) => item!.documents)
        .flat()
        .filter((user) => user.followers.includes(currentUser.id));

    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full h-96'>
                <Loader />
            </div>
        );
    } else {
        return (
            <div className='explore-container'>
                <div className='explore-inner_container'>
                    <div className='max-w-5x1 flex-start gap-3 justify-start w-full'>
                        <FontAwesomeIcon
                            icon={['fas', 'users']}
                            className='fa-2xl text-light-3'
                        />
                        <h2 className='h3-bold md:h2-bold text-left w-full'>
                            Personnes
                        </h2>
                    </div>

                    <div className='flex gap-1 w-full items-center rounded-lg bg-dark-3'>
                        <FontAwesomeIcon
                            icon={['fas', 'magnifying-glass']}
                            className='fa-lg mx-3'
                        />
                        <Input
                            type='text'
                            placeholder='Rechercher'
                            className='explore-search'
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>
                <div className='flex flex-wrap gap-9 w-full max-w-5xl mt-8'>
                    {shouldShowSearchResults ? (
                        <SearchResults
                            isSearchFetching={isSearchFetching}
                            searchedUsers={searchedUsers as any}
                        />
                    ) : shouldShowUsers ? (
                        <p className='text-light-4 mt-10 text-center w-full'>
                            Plus d'utilisateurs à venir
                        </p>
                    ) : (
                        <>
                            <h3 className='body-bold md:h3-bold text-start w-full mt-4'>
                                Suivies
                            </h3>
                            <GridUsersList users={followingUsers} />
                            <h3 className='body-bold md:h3-bold text-start w-full mt-4'>
                                Toutes les autres
                            </h3>
                            {users.pages
                                .filter((page) => page.documents.length > 0)
                                .map((item, index) => (
                                    <GridUsersList
                                        key={`page-${index}`}
                                        users={item!.documents}
                                        allUsers={true}
                                    />
                                ))}
                        </>
                    )}
                </div>
                {hasNextPage && !searchValue && (
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

export default Users;
