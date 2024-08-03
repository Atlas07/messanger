"use server";

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser } from '@/auth';
import { SignUpSchema, User } from '../models/user';

export type SignInState = {
    errors?: {
        email?: string[];
        password?: string[];
    };
    message?: string | null;
};

export type SignUpState = {
    errors: {
        email?: string[] | undefined;
        password?: string[] | undefined;
        name?: string[] | undefined;
    };
    message?: string | undefined;
};

export async function authenticate(
    _prevState: SignInState,
    formData: FormData,
): Promise<SignInState> {
    try {
        await signIn('credentials', formData);

        return { errors: {}, message: undefined }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { message: 'Invalid credentials.', errors: {} };
                default:
                    return { message: 'Something went wrong.', errors: {} };
            }
        }
        throw error;
    }
}

export async function signup(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
    try {
        const validatedFields = SignUpSchema
            .safeParse({
                email: formData.get("email"),
                password: formData.get("password"),
                name: formData.get("name")
            });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Missing Fields. Failed to Create User.',
            };
        }

        const { email, password, name } = validatedFields.data

        let createdUser: User | string = await createUser(email, password, name);
        console.log("createdUser", createdUser)

        if (typeof createdUser === "string") {
            return { message: createdUser, errors: {} }
        }

        return { errors: {}, message: undefined }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { message: 'Invalid credentials.', errors: {} };
                default:
                    return { message: 'Something went wrong.', errors: {} };
            }
        }
        throw error;
    }
}