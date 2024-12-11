import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function POST(req) {
    const { email, password } = await req.json() // Assuming data comes in JSON format

    const supabase = await createClient()

    // Validate the input data
    if (!email || !password) {
        return new Response('Missing email or password', { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    // If there's an error with authentication, redirect to the error page
    if (error) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/error',
            },
        })
    }

    // Revalidate the members page
    revalidatePath('/members', 'layout')

    // Redirect to the members page upon successful login
    return new Response(null, {
        status: 200,
        headers: {
            Location: '/members',
        },
    })
}
