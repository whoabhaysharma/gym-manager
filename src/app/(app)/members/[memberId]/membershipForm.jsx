'use client';

import { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Updated schema with transformations
const formSchema = z.object({
    start_date: z.string({
        required_error: "Start date is required",
    }),
    amount: z
        .string()
        .refine((val) => !isNaN(Number(val)), { message: "Amount must be a number" })
        .transform(Number),
    duration: z
        .string()
        .refine((val) => !isNaN(Number(val)), { message: "Duration must be a number" })
        .transform(Number),
});

export default function MembershipForm({ memberId, onSuccess = () => { } }) {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            start_date: "",
            amount: "0",
            duration: "1",
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/members/${memberId}/memberships`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                setSuccessMessage("Membership added successfully.");
                onSuccess()

            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || "Failed to add membership.");
            }
        } catch (error) {
            console.log(error, 'ERRORORRRRRRRRRRRRRR')
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duration (in months)</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(value)}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a duration" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[1, 3, 6, 9, 12].map((duration) => (
                                        <SelectItem key={duration} value={String(duration)}>
                                            {duration}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </Button>
                {successMessage && (
                    <p className="text-green-500 mt-2">{successMessage}</p>
                )}
                {errorMessage && (
                    <p className="text-red-500 mt-2">{errorMessage}</p>
                )}
            </form>
        </Form>
    );
}
