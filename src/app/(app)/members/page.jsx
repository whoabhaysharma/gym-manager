"use client"
import supabase from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MemberForm from "@/components/custom/MemberForm"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Page() {
    const [list, setList] = useState([])
    // Fetch the data using Supabase's from and select
    const getMembersData = async () => {
        const { data, error } = await supabase.rpc('get_members_with_days_remaining');

        if (error) {
            console.error('Error fetching members data:', error);
            return null;
        }
        setList(data);
    };

    useEffect(() => {

        getMembersData()
    }, [])

    return (
        <div>
            <div className="flex justify-between mb-3 mt-3 gap-3">
                <Input className="w-1/4" placeholder="Search Members..." />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Add Member</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Member</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <MemberForm />
                        <DialogFooter>
                            <Button className="w-full" type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Remaining Days</TableHead>
                        <TableHead className="text-right">Progress</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.map(item => {
                        return (
                            <TableRow key={item.id}>
                                <TableCell>{item.member_name}</TableCell>
                                <TableCell>
                                    <Badge>
                                        {item?.member_id}
                                    </Badge>
                                </TableCell>
                                <TableCell>{item.total_days_remaining}</TableCell>
                                <TableCell className="text-right">
                                    <Progress value={Math.min((item.total_days_remaining / 30) * 100, 100)} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
