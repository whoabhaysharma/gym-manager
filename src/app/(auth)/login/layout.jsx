import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
    const supabase = await createClient()

    const { data } = await supabase.auth.getUser()

    if (data.user) {
        redirect("/members")
    }

    return children
}