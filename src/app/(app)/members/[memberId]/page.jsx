'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { startCase, toLower } from "lodash";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MembershipForm from "./membershipForm";
import jsPDF from "jspdf"; // Import jsPDF
import axios from "axios";
import { Progress } from "@/components/ui/progress";

export default function MemberDetail({ params }) {
    const [memberData, setMemberData] = useState(null);
    const [membershipsData, setMembershipsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);

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

    const fetchData = async () => {
        try {
            const id = params.memberId;

            const memberResponse = await fetch(`/api/members/${id}`);
            const memberData = await memberResponse.json();
            setMemberData(memberData);

            const membershipsResponse = await fetch(`/api/members/${memberData.member.id}/memberships`);
            const membershipsData = await membershipsResponse.json();
            setMembershipsData(membershipsData);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params]);

    const downloadReceipt = () => {
        if (!memberData || !membershipsData) {
            alert("Data is not loaded yet.");
            return;
        }

        const doc = new jsPDF();
        const mom = moment(memberData.member.joining_date);

        // Header Section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Membership Receipt", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Fitbull Gym Management System", 105, 30, { align: "center" });
        doc.text("Generated on: " + moment().format("DD-MM-YYYY"), 105, 36, { align: "center" });

        // Separator
        doc.setDrawColor(0, 0, 0);
        doc.line(15, 40, 195, 40);

        // Member Details
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${startCase(toLower(memberData.member.name))}`, 20, 50);
        doc.text(`Bill Number: ${memberData.member.bill_number}`, 20, 60);
        doc.text(`Joining Date: ${mom.format("DD-MM-YYYY")}`, 20, 70);

        // Membership Details Section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Membership Details", 20, 85);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        let y = 95;

        (membershipsData?.membership || []).forEach((membership, index) => {
            const startDate = moment(membership.start_date).format("DD-MM-YYYY");
            doc.text(`${index + 1}. Start Date: ${startDate}`, 20, y);
            doc.text(`   Duration: ${membership.duration} Month(s)`, 20, y + 10);
            y += 20; // Adjust vertical spacing
        });

        // Signature Section
        if (y + 50 > 280) {
            // Add new page if content exceeds current page height
            doc.addPage();
            y = 20; // Reset y-coordinate on the new page
        }

        doc.line(15, y + 20, 195, y + 20); // Separator above signature
        doc.text("Authorized Signature:", 20, y + 40);

        // Add Signature Image (Replace with your image URL or base64 string)
        const signatureImageUrl = "/signature.png"; // Replace with the actual image URL
        const imgWidth = 50; // Adjust image width
        const imgHeight = 20; // Adjust image height (keep aspect ratio)
        const imgX = 80; // X position
        const imgY = y + 30; // Y position

        doc.addImage(signatureImageUrl, "PNG", imgX, imgY, imgWidth, imgHeight);

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for being a valued member!", 105, 290, { align: "center" });

        // Save the PDF
        doc.save(`${memberData.member.name}_Membership_Receipt.pdf`);
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!memberData || !membershipsData) {
        return <div>Error loading data.</div>;
    }

    const mom = moment(memberData.member.joining_date);

    return (
        <div>
            <div className="mb-4 flex flex-row justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        {isAdmin ? <Button>Add Membership +</Button> : <></>}
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Membership</DialogTitle>
                        </DialogHeader>
                        <MembershipForm
                            memberId={memberData.member.id}
                            onSuccess={() => {
                                fetchData();
                                setOpen(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-row justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{startCase(toLower(memberData.member.name))}</h2>
                            <div>
                                <Badge>{memberData.member.bill_number}</Badge>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600">
                            Joined on {mom.calendar()}
                        </p>
                    </div>
                </CardHeader>
            </Card>

            <Card className="w-full mx-auto mt-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Your Memberships</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(membershipsData?.membership || [])
                        .sort((a, b) => moment(b.start_date).diff(moment(a.start_date)))
                        .map((membership) => {
                            const startDate = moment(membership.start_date);
                            const endDate = startDate.clone().add(membership.duration, 'months');
                            const currentDate = moment();
                            const totalDurationDays = endDate.diff(startDate, 'days');
                            const elapsedDays = currentDate.diff(startDate, 'days');
                            const progress = Math.min((elapsedDays / totalDurationDays) * 100, 100);
                            const isActive = currentDate.isBetween(startDate, endDate);

                            return (
                                <Card key={membership.id} className={`overflow-hidden ${isActive ? 'border-green-500' : 'border-gray-200'}`}>
                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <Badge variant={isActive ? "default" : "secondary"}>
                                                {isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                            <span className="font-semibold">
                                                {membership.duration} Month{membership.duration > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-2 text-sm mb-2">
                                            <div>Start: {startDate.format("MMM D, YYYY")}</div>
                                            <div>End: {endDate.format("MMM D, YYYY")}</div>
                                        </div>
                                        <Progress value={progress} className="h-2 mb-2" />
                                        <div className="text-sm text-muted-foreground text-right">
                                            {Math.round(progress)}% Complete
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                </CardContent>
            </Card>

            {/* Download Receipt Button */}
            <div className="mt-4 flex justify-end">
                <Button onClick={downloadReceipt}>Download Receipt</Button>
            </div>
        </div>
    );
}
