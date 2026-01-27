import { UserRole } from '../enums/roles.enum';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    schoolId?: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
