"use client"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    const handleSubmit = async (event) => {
        event.preventDefault()

        setLoading(true)
        setError(null)

        try {
            // Make the POST request to the backend API using axios
            const response = await axios.post('/api/auth/login', { email, password })


            // If the login is successful, redirect or handle the response
            // For example, redirecting to the members page
            if (response.status === 200) {
                router.push("/members")
            }
        } catch (err) {
            console.error('Login failed:', err)
            setError("Login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-0 md:p-4">
            <Card className="w-full h-full md:h-auto md:max-w-md bg-white md:border md:border-gray-200 md:shadow-lg">
                <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full md:justify-start">
                    <CardHeader className="space-y-1 pt-8 md:pt-6">
                        <div className="flex justify-center mb-4">
                            <img width={"150px"} src='/fitbullBigg_logo.png' />
                        </div>
                        <CardTitle className="text-3xl font-bold text-center text-black">Fitbull Gym</CardTitle>
                        <CardDescription className="text-center text-gray-600">Strength in simplicity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow md:flex-grow-0">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-black">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-gray-300 focus:border-black focus:ring-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-black">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border-gray-300 focus:border-black focus:ring-black"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2 pb-8 md:pb-6">
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <Button
                            type="submit"
                            className={`w-full ${loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} text-white`}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
