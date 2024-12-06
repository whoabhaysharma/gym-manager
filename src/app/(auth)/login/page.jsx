"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters." })
        .max(50, { message: "Username must be at most 50 characters." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .max(100, { message: "Password must be at most 100 characters." }),
});

export default function Login() {
    const form = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data) => {
        // Handle form submission logic here
        console.log(data);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}