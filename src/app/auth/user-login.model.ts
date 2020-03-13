export interface UserLogin {
    email: string;
    firstName: string;
    imgUrl: string;
    lastName: string;
    userId: number;
    role: number;
    token?: string;
    features?: any;
    teams?: any[];
    selectedTeam?: number;
}