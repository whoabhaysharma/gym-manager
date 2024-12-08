'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import supabase from '@/lib/supabase/client'

export default function BillingForm({ initialValues = {} }) {
    const [billNumber, setBillNumber] = useState('')
    const [name, setName] = useState('')
    const [duration, setDuration] = useState('')
    const [amount, setAmount] = useState('')
    const [startDate, setStartDate] = useState('')

    // Update state when initialValues prop changes
    useEffect(() => {
        if (initialValues) {
            setBillNumber(initialValues.billNumber || '')
            setName(initialValues.name || '')
            setDuration(initialValues.duration || '')
            setAmount(initialValues.amount || '')
        }
    }, [initialValues])

    const handleSubmit = async (e) => {
        e.preventDefault()
        // const { data: createdData, error } = await supabase
        //     .from("members")
        //     .insert({
        //         name: name,
        //         bill_number: billNumber,
        //         joining_date :
        //     })

        // if (error) {
        //     console.error('Error creating entry:', error)
        //     return { success: false, error }
        // }

        // console.log('Entry created successfully:', createdData)
        // return { success: true, data: createdData }
        console.log('Form submitted', { billNumber, name, duration, amount })
        // Reset form fields after submission
        setBillNumber('')
        setName('')
        setDuration('')
        setAmount('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-3">
                <div className="space-y-1">
                    <Label htmlFor="billNumber">Bill Number</Label>
                    <Input
                        id="billNumber"
                        type="number"
                        placeholder="Enter bill number"
                        value={billNumber}
                        onChange={(e) => setBillNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="duration">Duration (Months)</Label>
                    <Select value={duration} onValueChange={setDuration} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 month</SelectItem>
                            <SelectItem value="3">3 months</SelectItem>
                            <SelectItem value="9">9 months</SelectItem>
                            <SelectItem value="12">12 months</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="startDate">Start Date / Joining Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
            </div>
        </form>
    )
}
