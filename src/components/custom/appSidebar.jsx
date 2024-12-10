import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export function AppSidebar() {
    async function signOut() {
        'use server'
        const supabase = await createClient()
        const { error } = await supabase.auth.signOut()
        if (!error) {
            redirect('/login')
        }
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <div>
                    <h1 className={"text-2xl font-bold text-center"}>Fitbull Manager</h1>
                    <Separator className="mt-2 mb-2" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <a
                        className="px-4 py-2 rounded-md transition-all flex gap-3 items-center bg-slate-100"
                        href={"/members"}
                    >
                        <Users size={15} />
                        <span>{"Members"}</span>
                    </a>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                {/* Add sign-out button */}
                <form action={signOut}>
                    <button
                        type="submit"
                        className="px-4 py-2 w-full justify-center font-bold rounded-md transition-all flex gap-3 items-center bg-slate-100"
                    >
                        <span>{"Logout"}</span>
                    </button>
                </form>
            </SidebarFooter>
        </Sidebar>
    );
}
