import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

export const GET = (req: NextRequest) => {
    return auth0.middleware(req);
};
