// MemberDetail.js
'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { startCase, toLower } from "lodash";
import { useState, useEffect, use } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MembershipForm from "./membershipForm";

export default function MemberDetail({ params }) {
    const [memberData, setMemberData] = useState(null);
    const [membershipsData, setMembershipsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const paramResolved = use(params)

    const fetchData = async () => {
        try {
            const id = paramResolved.memberId;

            const memberResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/members/${id}`);
            const memberData = await memberResponse.json();
            setMemberData(memberData);

            const membershipsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/members/${memberData.member.id}/memberships`);
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
    }, [paramResolved]);

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
                                fetchData()
                                setOpen(false)
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
        </div>
    );
}