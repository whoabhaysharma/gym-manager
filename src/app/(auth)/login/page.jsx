import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-0 md:p-4">
            <Card className="w-full h-full md:h-auto md:max-w-md bg-white md:border md:border-gray-200 md:shadow-lg">
                <form className="flex flex-col justify-between h-full md:justify-start">
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
                                className="border-gray-300 focus:border-black focus:ring-black"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2 pb-8 md:pb-6">
                        <Button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800 text-white"
                            formAction={login}
                        >
                            Log in
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

