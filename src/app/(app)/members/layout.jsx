import { AppSidebar } from "@/components/custom/appSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {

    const cookieStore = (await cookies());
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect('/login')
    }

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 flex flex-col p-5">
                    <SidebarTrigger />
                    {children}
                </main>
                <Toaster />
            </SidebarProvider>
        </>
    )
}