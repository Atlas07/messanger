import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnChat = nextUrl.pathname.startsWith('/chat');

            if (isOnChat) {
                return isLoggedIn;
            }

            return true;
        },
        redirect({ url, baseUrl }) {
            return '/chat';
        },
    },
    providers: [],
}
