"use client"
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
            {!loading && children}
        </>
    )
}