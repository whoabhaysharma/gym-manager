"use client"
import { AppSidebar } from "@/components/custom/appSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Layout({ children }) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            setLoading(false)
        } else {
            router.push("/login")
        }
    })

    return (
        <>
            {!loading && (
                <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1 flex flex-col p-5">
                        <SidebarTrigger />
                        {children}
                    </main>
                    <Toaster />
                </SidebarProvider>
            )}
        </>
    )
}