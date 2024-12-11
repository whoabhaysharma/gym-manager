import { createClient } from '@/lib/supabase/server';

export async function GET(req) {
    const search = req.nextUrl.searchParams.get("search")
    const pageNumber = req.nextUrl.searchParams.get("page")
    const max = req.nextUrl.searchParams.get("max")

    const supabase = await createClient();

    // Fetch members from the 'members' table
    const { data : members, error } = await supabase.rpc('members_list', {
        search_term: search,
        page_number: pageNumber,
        page_size: max,
    });
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
    return new Response(JSON.stringify({ members }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}