import { createClient } from '@/lib/supabase/server';

export async function GET(req) {
    const supabase = await createClient();

    // Fetch members from the 'members' table
    const { count, error } = await supabase
        .from("members") // Assuming you have a 'members' table
        .select("id", { count: "exact", head: true })
    // Handle errors
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Return success response with members data
    return new Response(JSON.stringify({ count }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}