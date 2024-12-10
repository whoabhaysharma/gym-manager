"use client";
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
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MemberForm from "@/components/custom/MemberForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownNarrowWide, EllipsisVertical } from "lucide-react";
import { debounce } from "lodash";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // Assuming this is available in your design system
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [totalItems, setTotalItems] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const router = useRouter()
    // Fetch the data using Supabase's RPC function
    const getMembersData = async (search = null, page = 1, size = 10) => {
        try {
            // Make the API request using Axios
            const response = await axios.get('/api/members/list', {
                params: {
                    search, // Search term
                    page,   // Page number
                    max: size // Maximum number of members to fetch
                }
            });

            // Check if the API returns a valid response
            if (response.status === 200) {
                // Assuming 'data' contains the list of members
                setList(response.data.members); // Assuming you have a state variable 'setList' to update the list
            } else {
                console.error("Error fetching members data:", response.statusText);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    const handleDialogClose = () => {
        getMembersData()
        setIsDialogOpen(false); // Close the dialog
    };

    // Fetch total members count
    const getTotalMembersCount = async (search = null) => {
        try {
            try {
                // Make the API request using Axios
                const response = await axios.get('/api/members/count');

                // Check if the API returns a valid response
                if (response.status === 200) {
                    // Assuming 'data' contains the list of members
                    setTotalItems(response.data.count); // Assuming you have a state variable 'setList' to update the list
                } else {
                    console.error("Error fetching members data:", response.statusText);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
            }
        } catch (error) {
            console.error("Unexpected error fetching total members count:", error);
        }
    };

    // Debounced version of getMembersData
    const debouncedGetMembersData = useCallback(
        debounce((name) => {
            getMembersData(name, currentPage, pageSize);
            getTotalMembersCount(name); // Get total count whenever search changes
        }, 300),
        [currentPage, pageSize]
    );

    useEffect(() => {
        debouncedGetMembersData(searchTerm);
        return () => {
            debouncedGetMembersData.cancel();
        };
    }, [searchTerm, debouncedGetMembersData]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        getMembersData(searchTerm, page, pageSize);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when page size changes
        getMembersData(searchTerm, 1, size);
    };

    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <div>
            <div className="flex justify-between mb-3 mt-3 gap-3">
                <Input
                    className="w-1/4"
                    placeholder="Search Members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsDialogOpen(true)}>Add Member</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Member</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <MemberForm onSuccess={handleDialogClose} /> {/* Close on success */}
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>
                            <div className="flex gap-2 items-center">
                                Remaining Days
                                <ArrowDownNarrowWide size={15} />
                            </div>
                        </TableHead>
                        <TableHead className="text-right">Progress</TableHead>
                        <TableHead className="text-right">Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.map(item => (
                        <TableRow key={item.member_id}>
                            <TableCell className="cursor-pointer" onClick={() => router.push(`/members/${item.member_id}`)}>{item.member_name}</TableCell>
                            <TableCell>
                                <Badge>{item?.member_id}</Badge>
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
                                        <DropdownMenuItem onClick={() => console.log("hello")}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                        <DropdownMenuItem>Attendance</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-4 flex justify-end items-end">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    onClick={() => handlePageChange(i + 1)}
                                    className={currentPage === i + 1 ? 'bg-gray-200 p-2 rounded' : ''}
                                >
                                    {i + 1}
                                </PaginationLink>

                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
