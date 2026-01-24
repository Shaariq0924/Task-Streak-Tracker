export interface Category {
    _id: string;
    name: string;
    color: string;
    currentStreak: number;
    history: string[];
}

export interface Task {
    _id: string;
    text: string;
    isCompleted: boolean;
    categoryId: string;
    createdAt: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
}
