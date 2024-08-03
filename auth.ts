import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from './auth.config';
import prisma from "./app/lib/prisma";
import bcrypt from 'bcrypt';

import { User, SignInSchema } from "./app/models/user";

async function getUser(email: string): Promise<User | string> {
    try {
        const user = await prisma.user.findMany({ where: { email } })

        return user[0]
    } catch (error: any) {
        console.error('Failed to fetch user:', error);
        return error.message ?? `Failed to fetch user, ${email}`;
    }
}

export async function createUser(email: string, password: string, name: string): Promise<User | string> {
    try {
        const user = await prisma.user.findMany({ where: { email } })

        if (user.length) {
            return `User with such email exists, ${email}`
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            }
        })

        return createdUser
    } catch (error: any) {
        console.error('Failed to create user:', error);
        return error?.message ?? "Failed to create user"
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = SignInSchema.safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (typeof user === "string") return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
})