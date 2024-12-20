"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import axios from "axios";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function MembersPage() {
    const [list, setList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [totalItems, setTotalItems] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
    const [minRemainingDays, setMinRemainingDays] = useState("");
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const observerTarget = useRef(null);
    const router = useRouter();

    const isAdmin = userId === "f21fb98f-1721-4436-ba44-0aad85bf9bea";

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/auth/user");
            setUserId(data?.id || null);
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    const fetchMembers = async ({ search = "", page = 1, size = 20, append = false }) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get("/api/members/list", {
                params: {
                    minRemainingDays,
                    order: sortConfig.key && sortConfig.direction ? `${sortConfig.key},${sortConfig.direction}` : "",
                    name: isNaN(parseInt(search)) ? search : "",
                    code: isNaN(parseInt(search)) ? "" : search,
                    page,
                    max: size,
                },
            });

            setList((prev) => (append ? [...prev, ...data.members] : data.members));
            setTotalItems(data.totalCount);
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        fetchMembers({});
    };

    const debouncedFetchMembers = useCallback(
        debounce((search) => {
            fetchMembers({ search, page: 1, size: pageSize });
        }, 300),
        [sortConfig, minRemainingDays, pageSize]
    );

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        debouncedFetchMembers(searchTerm);
        return () => debouncedFetchMembers.cancel();
    }, [searchTerm, debouncedFetchMembers]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && currentPage < Math.ceil(totalItems / pageSize)) {
                    fetchMembers({ page: currentPage + 1, size: pageSize, append: true });
                    setCurrentPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [isLoading, currentPage, totalItems, pageSize]);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <div className="w-full p-4">
            <div className="flex justify-between mb-4">
                <Input
                    className="w-full sm:w-1/3"
                    placeholder="Search Members..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                {isAdmin && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Add Member</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Member</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <MemberForm onSuccess={handleDialogClose} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="mb-4">
                <h4 className="font-bold mb-2">Filters</h4>
                <div className="flex gap-2">
                    {[30, 7].map((days) => (
                        <Badge
                            key={days}
                            className="cursor-pointer"
                            variant={minRemainingDays === -days ? "" : "outline"}
                            onClick={() => setMinRemainingDays((prev) => (prev === -days ? "" : -days))}
                        >
                            Not Active For {days} Days
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="hidden overflow-x-auto sm:block">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            {["name", "bill_number", "remaining_days"].map((key) => (
                                <TableHead key={key} onClick={() => handleSort(key)}>
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        <span>{startCase(toLower(key))}</span>
                                        {sortConfig.key === key && (sortConfig.direction === "asc" ? <ArrowUpNarrowWide size={15} /> : <ArrowDownNarrowWide size={15} />)}
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Progress</TableHead>
                            <TableHead className="text-right">Options</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {list.map((item, index) => (
                            <TableRow key={`${item.bill_number}-${index}`}>
                                <TableCell onClick={() => router.push(`/members/${item.bill_number}`)}>{startCase(toLower(item.name))}</TableCell>
                                <TableCell><Badge>{item.bill_number}</Badge></TableCell>
                                <TableCell>{item.remaining_days}</TableCell>
                                <TableCell className="text-right">
                                    <Progress value={Math.min((item.remaining_days / 30) * 100, 100)} />
                                </TableCell>
                                <TableCell className="text-right">
                                    {isAdmin && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <EllipsisVertical className="w-5 h-5 cursor-pointer" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                                <DropdownMenuItem>Attendance</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="block sm:hidden">
                {list.map((item, index) => (
                    <Card key={`${item.bill_number}-${index}`} className="mb-3" onClick={() => router.push(`/members/${item.bill_number}`)}>
                        <div className="p-4">
                            <div className="flex justify-between">
                                <h1 className="text-xl font-semibold">{startCase(toLower(item.name))}</h1>
                                <Badge>{item.bill_number}</Badge>
                            </div>
                            <div className="flex items-end gap-1 mt-2">
                                <span className="text-xl font-bold">{item.remaining_days}</span>
                                <span className="text-xs">Days remaining</span>
                            </div>
                            <Progress value={Math.min((item.remaining_days / 30) * 100, 100)} />
                        </div>
                    </Card>
                ))}
            </div>

            <div ref={observerTarget} className="h-10 w-full text-center">
                {isLoading && <div>Loading more...</div>}
            </div>
            {isLoading && (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
        </div>
    );
}