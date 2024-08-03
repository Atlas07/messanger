import { z } from 'zod'
import prisma from '../lib/prisma'

import { User as UserModel } from "@prisma/client"

export const SignUpSchema = z.object({
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
        .max(24, { message: "Max length has to be 24 characters" }),
    name: z
        .string()
        .trim()
        .min(2, { message: "Min length hasa to be 2 characters" })
        .max(24, { message: "Max length has to be 24 characters" }),
})

export const SignInSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: "This field has to be filled" })
        .max(32, { message: "Max length has to be 32 characters" })
        .email({ message: 'Invalid Email' }),
    password: z
        .string()
        .trim(),
})

export type User = UserModel

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