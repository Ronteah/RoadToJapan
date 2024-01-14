import Loader from './Loader';
import GridUsersList from './GridUsersList';

type Props = {
    isSearchFetching: boolean;
    searchedUsers: any;
};

const SearchResults = ({ isSearchFetching, searchedUsers }: Props) => {
    if (isSearchFetching)
        return (
            <div className='flex-center w-full h-full'>
                <Loader />
            </div>
        );

    if (searchedUsers && searchedUsers.documents.length > 0) {
        return <GridUsersList users={searchedUsers.documents} />;
    }

    return (
        <p className='text-light-4 mt-10 text-center w-full opacity-35'>
            Aucun résultats
        </p>
    );
};

export default SearchResults;
