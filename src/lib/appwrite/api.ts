import {
    INewTraining,
    INewUser,
    IUpdateTraining,
    IUpdateUser,
    IUser,
} from '@/types';
import { account, appwriteConfig, avatars, databases, storage } from './config';
import { ID, Query } from 'appwrite';

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            user.username.toLowerCase(), // id
            user.email, // email
            user.password, // password
            user.name // name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function deleteUserAccount(user: IUser, userPassword: string) {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        if (user.imageId) {
            const deletedFile = await deleteFile(user.imageId);
            if (!deletedFile) throw Error;
        }

        const deleteUser = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.username.toLowerCase() // id
        );

        if (!deleteUser) throw Error;

        const changeEmail = await account.updateEmail(
            `deleted@${user.username}.fr`,
            userPassword
        );

        if (!changeEmail) throw Error;

        const blockUserAccount = await account.updateStatus();

        if (!blockUserAccount) throw Error;

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    name: string;
    email: string;
    username: string;
    imageUrl: URL;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.username.toLowerCase(), // id
            user
        );
        return newUser;
    } catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailSession(
            user.email,
            user.password
        );
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;

    try {
        let image = {
            imageId: user.imageId,
            imageUrl: user.imageUrl,
        };

        if (hasFileToUpdate) {
            const currentUser = await getCurrentUser();
            deleteFile(currentUser?.imageId!);

            const uploadedFile = await uploadFile(user.file[0]);

            if (!uploadedFile) throw Error;

            const fileUrl = getFilePreview(uploadedFile?.$id!);

            if (!fileUrl) {
                deleteFile(uploadedFile?.$id!);
                throw Error;
            }

            image = {
                ...image,
                imageId: uploadedFile?.$id!,
                imageUrl: fileUrl,
            };
        }

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                imageId: image.imageId,
                imageUrl: image.imageUrl,
                followers: user.followers,
                following: user.following,
            }
        );

        if (!updatedUser) {
            throw Error;
        }

        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}

export async function updateUserXp(
    userId: string,
    userXp: number,
    userLevel: number
) {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            {
                xp: userXp,
                level: userLevel,
            }
        );

        if (!updatedUser) {
            throw Error;
        }

        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}

export async function updateUserFollow(
    userId: string,
    userFollowers: string[],
    userFollowing: string[]
) {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            {
                followers: userFollowers,
                following: userFollowing,
            }
        );

        if (!updatedUser) {
            throw Error;
        }

        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}

export async function updateUserLikes(
    userId: string,
    userTrainingsLiked: string[]
) {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            {
                trainingsLiked: userTrainingsLiked,
            }
        );

        if (!updatedUser) {
            throw Error;
        }

        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        );

        if (!user) throw Error;

        return user;
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function createTraining(training: INewTraining) {
    try {
        const newTraining = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.trainingCollectionId,
            ID.unique(),
            {
                creator: training.userId,
                name: training.name,
                value: training.value,
                date: training.date,
                xp: training.xp,
            }
        );

        if (!newTraining) {
            throw Error;
        }

        return newTraining;
    } catch (error) {
        console.log(error);
    }
}

export async function updateTraining(training: IUpdateTraining) {
    try {
        const updatedTraining = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.trainingCollectionId,
            training.trainingId,
            {
                name: training.name,
                value: training.value,
                date: training.date,
                xp: training.xp,
                likes: training.likes,
            }
        );

        if (!updatedTraining) {
            throw Error;
        }

        return updatedTraining;
    } catch (error) {
        console.log(error);
    }
}

export async function updateTrainingLikes(
    trainingId: string,
    trainingLikes: number
) {
    try {
        const updatedTraining = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.trainingCollectionId,
            trainingId,
            {
                likes: trainingLikes,
            }
        );

        if (!updatedTraining) {
            throw Error;
        }

        return updatedTraining;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteTraining(trainingId: string) {
    if (!trainingId) throw Error;

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.trainingCollectionId,
            trainingId
        );

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

export async function getTrainingById(postId: string) {
    try {
        const training = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.trainingCollectionId,
            postId
        );

        if (!training) throw Error;

        return training;
    } catch (error) {
        console.log(error);
    }
}

export async function getInfiniteUsers({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        );

        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function getInfiniteUsersTraining({
    pageParam,
}: {
    pageParam: number;
}) {
    try {
        const currentUser = await getCurrentUser();

        const following = currentUser?.following;

        if (following.length === 0) {
            return [];
        }

        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('$id', following)]
        );

        if (!users) throw Error;

        const queries: any[] = [
            Query.orderDesc('$createdAt'),
            Query.limit(10),
            Query.equal(
                'creator',
                users.documents.map((document) => document.$id)
            ),
        ];

        if (pageParam) {
            queries.push(Query.cursorAfter(pageParam.toString()));
        }

        const trainings = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.trainingCollectionId,
            queries
        );

        if (!trainings) throw Error;

        return trainings;
    } catch (error) {
        console.log(error);
    }
}

export async function searchUsers(searchTerm: string) {
    try {
        let users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.search('name', searchTerm)]
        );

        if (users.documents.length === 0) {
            users = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                [Query.search('username', searchTerm)]
            );
        }

        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserTrainings(userId: string) {
    try {
        const trainings = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.trainingCollectionId,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        );

        if (!trainings) throw Error;

        return trainings;
    } catch (error) {
        console.log(error);
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            'top',
            100
        );

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}
