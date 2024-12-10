import { createClient } from '@/lib/supabase/server';

export async function GET(req) {
    // Extract the memberId from the URL query parameters
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();  // Assuming the route is '/api/members/[id]'

    if (!id) {
        return new Response(JSON.stringify({ error: 'Missing memberId' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const supabase = await createClient();

    // Fetch member data from the 'members' table where 'bill_number' equals the provided id
    const { data, error, count } = await supabase
        .from('members') // Assuming you have a 'members' table
        .select('*', { count: 'exact' })  // Enable count
        .eq('bill_number', id); // Filter by 'bill_number'

    // Handle errors
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    if (count === 0) {
        return new Response(JSON.stringify({ error: 'Member not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Return success response with member data
    return new Response(JSON.stringify({ member: data[0] }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
