"use server";

import { redirect } from 'next/navigation'
import { z } from 'zod'


// const EMAIL_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const SignInSchema = z.object({
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
    // .regex(EMAIL_REGEX, {
    //     message: "Password must contain a number, a special character, an uppercase letter, and a lowercase letter"
    // })
})

// export type SignIn = z.infer<typeof SignInSchema>;

export type SignInState = {
    errors?: {
        email?: string[];
        password?: string[];
    };
    message?: string | null;
};

export async function authenticate(
    prevState: SignInState,
    formData: FormData,
) {
    try {
        console.log(formData.get("password"))
        const validatedFields = SignInSchema.safeParse({
            email: formData.get("email"),
            password: formData.get("password"),
        })

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const { email, password } = validatedFields.data
        console.log({ email, password })


    } catch (error) {
        // if (error instanceof AuthError) {
        //     switch (error.type) {
        //         case "CredentialsSignin":
        //             return "Invalid credentials.";
        //         default:
        //             return "Something went wrong.";
        //     }
        // }
        // throw error;
        console.log(error)
        return { message: 'Failed to authenticate' }
    }

    redirect('/chat');
}
