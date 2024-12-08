'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BillingForm() {
    const [billNumber, setBillNumber] = useState('')
    const [name, setName] = useState('')
    const [duration, setDuration] = useState('')
    const [amount, setAmount] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically send the form data to your backend
        console.log('Form submitted', { billNumber, name, duration, amount })
        // Reset form fields after submission
        setBillNumber('')
        setName('')
        setDuration('')
        setAmount('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='space-y-3'>
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
            </div>
        </form>
    )
}