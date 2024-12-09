'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import supabase from "@/lib/supabase/client"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const FormSchema = z.object({
    billNumber: z.number().min(1, { message: 'Bill number is required' }),
    name: z.string().min(2, { message: 'Name is required' }),
    duration: z.string().min(1, { message: 'Duration is required' }),
    amount: z.number().min(1, { message: 'Amount is required' }),
    startDate: z.string().min(1, { message: 'Start date is required' }),
});

export default function BillingForm({ initialValues = {} }) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            billNumber: initialValues.billNumber || undefined,
            name: initialValues.name || undefined,
            duration: initialValues.duration || undefined,
            amount: initialValues.amount || undefined,
            startDate: initialValues.startDate || undefined
        },
    });

    const onSubmit = async (formData) => {
        console.log('Form Data:', formData);

        setLoading(true);

        try {
            // Insert the new member
            const { data: insertedMember, error: memberError } = await supabase
                .from("members")
                .insert({
                    name: formData.name,
                    bill_number: formData.billNumber,
                    joining_date: formData.startDate,
                })
                .select("*")
                .single();

            if (memberError) {
                handleInsertError(memberError, formData.billNumber);
                return { success: false, error: memberError };
            }

            console.log('Inserted Member:', insertedMember);

            // Insert the membership for the new member
            const { data: membership, error: membershipError } = await supabase
                .from("memberships")
                .insert({
                    member_id: insertedMember.id, // Assuming bill number maps to member_id
                    start_date: formData.startDate,
                    duration: parseInt(formData.duration, 10),
                    amount: formData.amount,
                });

            if (membershipError) {
                console.error('Error creating membership:', membershipError);
                return { success: false, error: membershipError };
            }

            console.log('Membership Created:', membership);

            // Reset the form on success
            form.reset();

            return { success: true, data: { member: insertedMember, membership } };

        } catch (error) {
            console.error('Unexpected Error:', error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    // Helper function to handle specific errors
    const handleInsertError = (error, billNumber) => {
        if (error.code === "23505") {
            toast({
                title: "Duplicate Bill Number",
                description: `There is already a member present with bill number ${billNumber}.`,
            });
        } else {
            console.error('Error creating entry:', error);
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                    control={form.control}
                    name="billNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bill Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter bill number"
                                    type="number"
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter name"
                                    type="text"
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duration (Months)</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="1">1 month</SelectItem>
                                    <SelectItem value="3">3 months</SelectItem>
                                    <SelectItem value="9">9 months</SelectItem>
                                    <SelectItem value="12">12 months</SelectItem>
                                </SelectContent>
                            </Select>
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
                                <Input
                                    placeholder="Enter amount"
                                    type="number"
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date / Joining Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit">
                    {loading ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    )
}