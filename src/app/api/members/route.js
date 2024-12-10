import { createClient } from '@/lib/supabase/server'; // Adjust the path as needed

export async function POST(req) {
    try {
        const body = await req.json(); // Parse the request body
        const { name, bill_number, joining_date } = body;

        // Validate the input fields
        if (!name || typeof bill_number !== 'number' || !joining_date) {
            return new Response(
                JSON.stringify({ error: 'Missing or invalid fields' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const supabase = await createClient();

        // Insert the data into the 'members' table
        const { data, error } = await supabase
            .from('members')
            .insert([{ name, bill_number, joining_date }])
            .select()

        if (error) {
            return new Response(
                JSON.stringify({ error: error.message }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        return new Response(
            JSON.stringify({ success: true, member: data[0] }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.log(error, 'ERROR')
        return new Response(
            JSON.stringify({ error: 'An unexpected error occurred' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
