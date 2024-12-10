'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { startCase, toLower } from "lodash";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MembershipForm from "./membershipForm";
import jsPDF from "jspdf"; // Import jsPDF

export default function MemberDetail({ params }) {
    const [memberData, setMemberData] = useState(null);
    const [membershipsData, setMembershipsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);

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
                        <Button>Add Membership +</Button>
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

            <Card className="mt-3">
                <CardHeader>
                    <h1 className="text-lg">Memberships</h1>
                </CardHeader>
                <CardContent>
                    {(membershipsData?.membership || []).map((membership) => (
                        <div key={membership.id}>
                            <div className="w-full flex flex-row justify-between">
                                <p>Start Date: {moment(membership.start_date).format("DD-MM-YYYY")}</p>
                                <Badge>{`${membership.duration} Month`}</Badge>
                            </div>
                            <Separator className="mt-4 mb-4" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Download Receipt Button */}
            <div className="mt-4 flex justify-end">
                <Button onClick={downloadReceipt}>Download Receipt</Button>
            </div>
        </div>
    );
}