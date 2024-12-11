import { AppSidebar } from "@/components/custom/appSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
    const supabase = await createClient()

    const { data } = await supabase.auth.getUser()

    if (!data.user) {
        redirect("/login")
    }

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full p-5">
                    <SidebarTrigger />
                    {children}
                </main>
                <Toaster />
            </SidebarProvider>
        </>
    )
}