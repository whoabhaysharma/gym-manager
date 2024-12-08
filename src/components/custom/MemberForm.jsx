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
import { useRouter } from "next/navigation"
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

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const { data: createdData, error } = await supabase
                .from("members")
                .insert({
                    name: data.name,
                    bill_number: data.billNumber,
                    joining_date: data.startDate
                })

            if (error) {
                if (error.code === "23505") {
                    toast({
                        title: "Duplicate Bill Number",
                        description: "There is already a member present with bill number " + data.billNumber,
                    })
                }
                setLoading(false)
                console.error('Error creating entry:', error)
                return { success: false, error }
            }
            form.reset()

            console.log('Form submitted', data, createdData)

        } catch (e) {
            console.log(e, 'GOT THIS ERROR')
        } finally {
            setLoading(false)
        }

    }

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