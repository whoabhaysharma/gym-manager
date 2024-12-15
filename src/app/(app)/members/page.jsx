"use client";
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
import { ArrowDownNarrowWide, ArrowUpNarrowWide, EllipsisVertical } from "lucide-react";
import { debounce, startCase, toLower } from "lodash";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; // Assuming this is available in your design system
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardHeader } from "@/components/ui/card";

export default function Page() {
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
    const [minRemainigDays, setMinRemainigDays] = useState('')
    const router = useRouter()

    const [userId, setUserId] = useState(null);

    const isAdmin = userId === "f21fb98f-1721-4436-ba44-0aad85bf9bea"


    const getUser = async () => {
        try {
            // Hit the /api/auth/user endpoint to get user data
            const response = await axios.get('/api/auth/user')

            // Extract the user id from the response and set it in the state
            if (response.data && response.data.id) {
                setUserId(response.data.id)
            }
        } catch (err) {
            console.error('Error fetching user:', err)
        }
    }

    useEffect(() => {
        getUser()
    }, [])
    // Fetch the data using Supabase's RPC function
    const getMembersData = async (search = null, page = 1, size = 10) => {
        try {
            // Make the API request using Axios
            const response = await axios.get('/api/members/list', {
                params: {
                    minRemainingDays: minRemainigDays,
                    order: (!sortConfig.key || !sortConfig.direction) ? '' : `${sortConfig.key},${sortConfig.direction}`,
                    name: isNaN(parseInt(search)) ? search : '', // Search term
                    code: isNaN(parseInt(search)) ? '' : search,
                    page,   // Page number
                    max: size // Maximum number of members to fetch
                }
            });

            // Check if the API returns a valid response
            if (response.status === 200) {
                // Assuming 'data' contains the list of members
                setList(response.data.members); // Assuming you have a state variable 'setList' to update the list
                setTotalItems(response.data.totalCount)
            } else {
                console.error("Error fetching members data:", response.statusText);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    const handleDialogClose = () => {
        getMembersData('', 1, 20)
        setIsDialogOpen(false); // Close the dialog
    };

    // Debounced version of getMembersData
    const debouncedGetMembersData = useCallback(
        debounce((name) => {
            getMembersData(name, currentPage, pageSize);
        }, 300),
        [currentPage, pageSize, sortConfig, minRemainigDays]
    );

    useEffect(() => {
        debouncedGetMembersData(searchTerm);
        return () => {
            debouncedGetMembersData.cancel();
        };
    }, [searchTerm, debouncedGetMembersData, sortConfig, minRemainigDays]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        getMembersData(searchTerm, page, pageSize);
    };

    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <div>
            <div className="flex justify-between mb-3 mt-3 gap-3">
                <Input
                    className="w-full sm:w-1/4"
                    placeholder="Search Members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        {isAdmin ? <Button onClick={() => setIsDialogOpen(true)}>Add Member</Button> : <></>} 
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
            <div className="my-1">
                <h4 className="hidden sm:block font-bold mb-1">Hide Members</h4>
                <div className="flex flex-row gap-3 overflow-auto">
                    <Badge className={"p-2 cursor-pointer sm:p-1"} onClick={() => setMinRemainigDays(prev => prev === -30 ? '' : -30)} variant={minRemainigDays === -30 ? '' : 'outline'}>Not Active For more then 30 days</Badge>
                    <Badge className={"p-2 cursor-pointer sm:p-1"} onClick={() => setMinRemainigDays(prev => prev === -7 ? '' : -7)} variant={minRemainigDays === -7 ? '' : 'outline'}>Not Active For 7 days</Badge>
                </div>
            </div>
            <div className="hidden sm:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">
                                <div className="flex gap-2 items-center cursor-pointer select-none" onClick={() => {
                                    setSortConfig({ key: 'name', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })
                                }}>
                                    <span>Name</span>
                                    {sortConfig.key === "name" && sortConfig.direction === 'asc' && <ArrowUpNarrowWide size={15} />}
                                    {sortConfig.key === "name" && sortConfig.direction === 'desc' && <ArrowDownNarrowWide size={15} />}
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex gap-2 items-center cursor-pointer select-none" onClick={() => {
                                    setSortConfig({ key: 'bill_number', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })
                                }}>
                                    <span>Code</span>
                                    {sortConfig.key === "bill_number" && sortConfig.direction === 'asc' && <ArrowUpNarrowWide size={15} />}
                                    {sortConfig.key === "bill_number" && sortConfig.direction === 'desc' && <ArrowDownNarrowWide size={15} />}
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex gap-2 items-center cursor-pointer select-none" onClick={() => {
                                    setSortConfig({ key: 'remaining_days', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })
                                }}>
                                    <span>Remaining Days</span>
                                    {sortConfig.key === "remaining_days" && sortConfig.direction === 'asc' && <ArrowUpNarrowWide size={15} />}
                                    {sortConfig.key === "remaining_days" && sortConfig.direction === 'desc' && <ArrowDownNarrowWide size={15} />}
                                </div>
                            </TableHead>
                            <TableHead className="text-right">Progress</TableHead>
                            <TableHead className="text-right">Options</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {list.map(item => (
                            <TableRow key={item.bill_number}>
                                <TableCell className="cursor-pointer" onClick={() => router.push(`/members/${item.bill_number}`)}>{startCase(toLower(item.name))}</TableCell>
                                <TableCell>
                                    <Badge>{item?.bill_number}</Badge>
                                </TableCell>
                                <TableCell>{item.remaining_days}</TableCell>
                                <TableCell className="text-right">
                                    <Progress value={Math.min((item.remaining_days / 30) * 100, 100)} />
                                </TableCell>
                                <TableCell className="text-right flex justify-end items-center">
                                    {isAdmin ? (
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
                                    ) : <></>}

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="sm:hidden">
                {list.map(item => {
                    return (
                        <Card className="mb-3" onClick={() => router.push(`/members/${item.bill_number}`)}>
                            <div className="p-4">
                                <div className="flex justify-between">
                                    <h1 className="text-2xl font-semibold">
                                        {startCase(toLower(item.name))}
                                    </h1>
                                    <Badge className={"mt-1"}>
                                        {item.bill_number}
                                    </Badge>
                                </div>
                                <div className="flex flex-row gap-1 items-end mt-2">
                                    <span className="text-2xl font-black">
                                        {item.remaining_days}
                                    </span>
                                    <span className="text-xs mb-1.5">
                                        Days remaining
                                    </span>
                                </div>
                                <div className="mt-0">
                                    <Progress value={Math.min((item.remaining_days / 30) * 100, 100)} />
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            <div className="mt-4 flex overflow-auto justify-end items-end">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>

                        {/* Show truncated page numbers */}
                        {currentPage > 3 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={() => handlePageChange(1)}
                                    className={currentPage === 1 ? 'bg-gray-200 p-2 rounded' : ''}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {currentPage > 4 && (
                            <PaginationItem>
                                <PaginationLink href="#" disabled className="p-2">...</PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Display pages before, current, and after */}
                        {Array.from({ length: 3 }, (_, i) => (
                            currentPage - 2 + i > 0 && currentPage - 2 + i <= totalPages && (
                                <PaginationItem key={currentPage - 2 + i}>
                                    <PaginationLink
                                        href="#"
                                        onClick={() => handlePageChange(currentPage - 2 + i)}
                                        className={currentPage === currentPage - 2 + i ? 'bg-gray-200 p-2 rounded' : ''}
                                    >
                                        {currentPage - 2 + i}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        ))}

                        {currentPage < totalPages - 3 && (
                            <PaginationItem>
                                <PaginationLink href="#" disabled className="p-2">...</PaginationLink>
                            </PaginationItem>
                        )}

                        {currentPage < totalPages - 2 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={() => handlePageChange(totalPages)}
                                    className={currentPage === totalPages ? 'bg-gray-200 p-2 rounded' : ''}
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        )}

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
