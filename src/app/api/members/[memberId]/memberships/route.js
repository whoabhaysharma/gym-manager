import { createClient } from '@/lib/supabase/server';

export async function GET(req) {
    // Extract memberId from the URL path (e.g., /members/[memberId]/memberships)
    const url = new URL(req.url);
    const memberId = url.pathname.split('/')[3]; // Extract the memberId from the URL path

    console.log(memberId, 'MEMBERID')

    // Check if memberId is missing
    if (!memberId) {
        return new Response(JSON.stringify({ error: 'Missing memberId' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const supabase = await createClient();

    // Fetch the membership for the provided memberId from the 'memberships' table
    const { data, error } = await supabase
        .from('memberships') // Querying the 'memberships' table
        .select('*') // Select the columns you need
        .eq('member_id', memberId) // Filter by the 'member_id' column

    // Handle errors
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // If no membership found, return 404
    if (!data) {
        return new Response(JSON.stringify({ error: 'Membership not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Return success response with the membership data
    return new Response(JSON.stringify({ membership: data }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
