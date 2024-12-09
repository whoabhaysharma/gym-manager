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
import { EllipsisVertical } from "lucide-react";
import { debounce } from "lodash";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // Assuming this is available in your design system
import { useRouter } from "next/navigation";

export default function Page() {
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const router = useRouter()
    // Fetch the data using Supabase's RPC function
    const getMembersData = async (search = null, page = 1, size = 10) => {
        try {
            const { data, error } = await supabase.rpc('get_members_with_pagination', {
                search_term: search,
                page_number: page,
                page_size: size,
            });

            if (error) {
                console.error("Error fetching members data:", error);
            } else {
                setList(data);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    // Fetch total members count
    const getTotalMembersCount = async (search = null) => {
        try {
            const { count, error } = await supabase
                .from("members") // Assuming you have a 'members' table
                .select("id", { count: "exact", head: true })

            if (error) {
                console.error("Error fetching total members count:", error);
            } else {
                setTotalItems(count); // Set the total number of items for pagination
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
