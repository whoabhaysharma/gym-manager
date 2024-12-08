"use client"
import supabase from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisVertical, Hash } from "lucide-react";
import { debounce } from "lodash";

export default function Page() {
    const [list, setList] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    // Fetch the data using Supabase's from and select
    const getMembersData = async (search = null) => {
        try {
            const { data, error } = await supabase.rpc('search_membersv2', { search_term: search });

            if (error) {
                console.error('Error fetching members data:', error);
                // Handle the error appropriately (e.g., show an error message to the user)
            } else {
                setList(data);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        // Handle unexpected errors
        }
    };

    // Debounced version of getMembersData
    const debouncedGetMembersData = useCallback(
        debounce((name) => {
            getMembersData(name);
        }, 300), // Adjust the debounce delay (in milliseconds) as needed
        []
    );

    useEffect(() => {
        debouncedGetMembersData(searchTerm);
        // Cleanup the debounced function on unmount
        return () => {
            debouncedGetMembersData.cancel();
        };
    }, [searchTerm, debouncedGetMembersData]);

    return (
        <div>
            <div className="flex justify-between mb-3 mt-3 gap-3">
                <Input
                    className="w-1/4"
                    placeholder="Search Members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                        <TableHead className="text-right">Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.map(item => {
                        return (
                            <TableRow key={item.member_id}>
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
                                <TableCell className="text-right flex justify-end items-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVertical className="transition-all hover:bg-slate-400 w-5 h-5 rounded-full cursor-pointer" size={"15"} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => console.log('hello')}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Delete</DropdownMenuItem>
                                            <DropdownMenuItem>Attendance</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
