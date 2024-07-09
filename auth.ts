import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from './auth.config';
import prisma from "./app/lib/prisma";
import bcrypt from 'bcrypt';
import { z } from 'zod'

import { User } from "@prisma/client"

export const SignInSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: "This field has to be filled" })
        .max(32, { message: "Max length has to be 32 characters" })
        .email({ message: 'Invalid Email' }),
    password: z
        .string()
        .trim()
        .min(6, { message: "Min length has to be 6 characters" })
        .max(24, { message: "Max length has to be 24 characters" })
})

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await prisma.user.findMany({ where: { email } })
        console.log("user", user)

        return user[0]
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

async function createUser(email: string, password: string, name: string): Promise<User | undefined> {
    const user = await prisma.user.findMany({ where: { email } })

    if (user.length) {
        throw new Error("User with such email exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const createdUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            }
        })

        return createdUser
    } catch (error) {
        console.error('Failed to create user:', error);
        throw error
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
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
})