import { createClient } from '@/lib/supabase/server';

export async function GET(req) {
    const name = req.nextUrl.searchParams.get("name");
    const bill_number = req.nextUrl.searchParams.get("code");
    const pageNumber = parseInt(req.nextUrl.searchParams.get("page"), 10) || 1;
    const max = parseInt(req.nextUrl.searchParams.get("max"), 10) || 10;
    const minRemainingDays = req.nextUrl.searchParams.get("minRemainingDays");
    const order = req.nextUrl.searchParams.get("order") || "last_updated,desc";

    const supabase = await createClient();

    const from = (pageNumber - 1) * max; // Start index
    const to = from + max - 1; // End index

    // Start building the query
    let query = supabase
        .from("members")
        .select("*", { count: 'exact' }); // Include count in the query

    const [orderKey = "last_updated", orderValue = "asc"] = order.split(",");
    query = query.order(orderKey, { ascending: orderValue === 'asc' });
    query = query.range(from, to);

    if (minRemainingDays) {
        query = query.gte("remaining_days", minRemainingDays ?? -30);
    }
    if (bill_number) {
        query = query.eq("bill_number", bill_number);
    }
   
    if (name) {
        query = query.ilike('name', `%${name}%`);
    }
    // Execute the query
    const { data: members, count, error } = await query;

    // Handle errors
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // Return success response with members data and total count
    return new Response(JSON.stringify({ members, totalCount: count }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}