import { initAuth0 } from '@auth0/nextjs-auth0';

export const auth0 = initAuth0({
    // Optional: Add config if needed, but defaults are usually fine with Env Vars
    routes: {
        login: '/api/auth/login',
        callback: '/api/auth/callback',
        postLogoutRedirect: '/'
    }
});
