import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    // Check for error in getting user
    if (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400 }
        );
    }

    console.log(data, 'USER');

    // Return the user data correctly as a JSON string
    return new Response(
        JSON.stringify(data?.user || {}),
        { status: 200 }
    );
}
