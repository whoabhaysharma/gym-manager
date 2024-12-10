// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req) {
    return NextResponse.json({ message: 'Login route' });
}

export async function POST(req) {
    const supabase = await createClient();
    const { username, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
    });


    if (error || !data.session) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Set the token in an HTTP-only cookie
    const token = data.session.access_token; // Use access_token from Supabase session
    const res = NextResponse.json({ message: 'Login successful' });

    res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });

    return res;
}