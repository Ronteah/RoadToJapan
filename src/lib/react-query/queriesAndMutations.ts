import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import {
    createTraining,
    createUserAccount,
    deleteTraining,
    deleteUserAccount,
    getCurrentUser,
    getInfiniteUsers,
    getTrainingById,
    getUserById,
    getUserTrainings,
    searchUsers,
    signInAccount,
    signOutAccount,
    updateTraining,
    updateTrainingLikes,
    updateUser,
    updateUserFollow,
    updateUserLikes,
    updateUserXp,
} from '../appwrite/api';
import {
    INewTraining,
    INewUser,
    IUpdateTraining,
    IUpdateUser,
    IUser,
} from '@/types';
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
        onError: (error) => {
            throw Error(error.message);
        },
    });
};

export const useDeleteUserAccount = () => {
    return useMutation({
        mutationFn: ({
            user,
            userPassword,
        }: {
            user: IUser;
            userPassword: string;
        }) => deleteUserAccount(user, userPassword),
        onSuccess() {
            signOutAccount;
        },
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) =>
            signInAccount(user),
    });
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: IUpdateUser) => updateUser(user),
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
            });
        },
    });
};

export const useUpdateUserXp = () => {
    return useMutation({
        mutationFn: ({
            userId,
            userXp,
            userLevel,
        }: {
            userId: string;
            userXp: number;
            userLevel: number;
        }) => updateUserXp(userId, userXp, userLevel),
    });
};

export const useUpdateUserFollow = () => {
    return useMutation({
        mutationFn: ({
            userId,
            userFollowers,
            userFollowing,
        }: {
            userId: string;
            userFollowers: string[];
            userFollowing: string[];
        }) => updateUserFollow(userId, userFollowers, userFollowing),
    });
};

export const useUpdateUserLikes = () => {
    return useMutation({
        mutationFn: ({
            userId,
            userTrainingsLiked,
        }: {
            userId: string;
            userTrainingsLiked: string[];
        }) => updateUserLikes(userId, userTrainingsLiked),
    });
};

export const useCreateTraining = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (training: INewTraining) => createTraining(training),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_TRAININGS],
            });
        },
    });
};

export const useUpdateTraining = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (training: IUpdateTraining) => updateTraining(training),
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TRAINING_BY_ID, data?.$id],
            });
        },
    });
};

export const useUpdateTrainingLikes = () => {
    return useMutation({
        mutationFn: ({
            trainingId,
            trainingLikes,
        }: {
            trainingId: string;
            trainingLikes: number;
        }) => updateTrainingLikes(trainingId, trainingLikes),
    });
};

export const useDeleteTraining = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ trainingId }: { trainingId: string }) =>
            deleteTraining(trainingId),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_TRAININGS],
            });
        },
    });
};

export const useGetTrainingById = (trainingId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_TRAINING_BY_ID, trainingId],
        queryFn: () => getTrainingById(trainingId),
        enabled: !!trainingId,
    });
};

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    });
};

export const useGetUserTrainings = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_TRAININGS, userId],
        queryFn: () => getUserTrainings(userId),
        enabled: !!userId,
    });
};

export const useGetUsers = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_USERS],
        queryFn: getInfiniteUsers as any,
        getNextPageParam: (lastPage: any) => {
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }

            const lastId =
                lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
        initialPageParam: null,
    });
};

export const useSearchUsers = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_TRAININGS, searchTerm],
        queryFn: () => searchUsers(searchTerm),
        enabled: !!searchTerm,
    });
};
