import { z } from "zod";

export const userRegisterSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name must be at most 50 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"),
})

export type UserRegisterType = z.infer<typeof userRegisterSchema>;

export interface User extends UserRegisterType {
    _id: string;
    createdAt: Date;
}