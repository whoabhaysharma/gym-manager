import { createClient } from '@/lib/supabase/server';

export async function GET(req) {
    // Extract memberId from the URL path (e.g., /members/[memberId]/memberships)
    const url = new URL(req.url);
    const memberId = url.pathname.split('/')[3]; // Extract the memberId from the URL path

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
        .eq('member_id', memberId); // Filter by the 'member_id' column

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

export async function POST(req) {
    try {
        const url = new URL(req.url);
        const memberId = url.pathname.split('/')[3]; // Extract the memberId from the URL path

        if (!memberId) {
            return new Response(JSON.stringify({ error: 'Missing memberId in URL' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const body = await req.json();

        // Validate required fields
        const { start_date, duration, amount } = body;
        if (!start_date || !duration || !amount) {
            return new Response(JSON.stringify({ error: 'Missing required fields in body' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const supabase = await createClient();

        // Insert the membership data into the 'memberships' table
        const { data, error } = await supabase
            .from('memberships')
            .insert([
                {
                    member_id: memberId, // Convert memberId to an integer
                    start_date,
                    duration,
                    amount,
                },
            ]);

        // Handle errors during insertion
        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Return success response
        return new Response(JSON.stringify({ success: true, membership: data }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
