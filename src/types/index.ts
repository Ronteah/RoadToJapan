export type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
    img: string;
    route: string;
    label: string;
};

export type ITraining = {
    userId: string;
    trainingId: string;
    name: string;
    value: number;
    date: string;
    xp: number;
    likes: number;
};

export type INewTraining = {
    userId: string;
    name: string;
    value: number;
    date: string;
    xp: number;
};

export type IUpdateTraining = {
    trainingId: string;
    name: string;
    value: number;
    date: string;
    xp: number;
    likes: number;
};

export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageId: string;
    imageUrl: string;
    file: File[];
    xp: number;
    level: number;
    followers: string[];
    following: string[];
    trainingsLiked: string[];
};

export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
};

export type IUpdateUser = {
    userId: string;
    name: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
    xp: number;
    level: number;
    followers: string[];
    following: string[];
    trainingsLiked: string[];
};
