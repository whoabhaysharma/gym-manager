"use client"
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function MemberDetail({ id }) {
    const [memberData, setMemberData] = useState(null);
    const [membershipsData, setMembershipsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the member's data and memberships from Supabase
    const getMemberData = async (id) => {
        try {
            setLoading(true);
            // Fetch the member details
            const { data: memberData, error: memberError } = await supabase
                .from("members")
                .select("*")
                .eq("bill_number", id)
                .single(); // Assuming member_id is unique, use .single() for one result

            console.log(memberData);
            if (memberError) throw memberError;

            // Fetch the memberships for the member
            const { data: membershipsData, error: membershipsError } = await supabase
                .from("memberships")
                .select("*")
                .eq("member_id", memberData.id)
                .order("start_date", { ascending: false }); // Order by start_date in descending order


            if (membershipsError) throw membershipsError;

            // Set the fetched data to state
            setMemberData(memberData);
            setMembershipsData(membershipsData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Call getMemberData when component is mounted or id changes
    useEffect(() => {
        if (id) {
            getMemberData(id);
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const mom = moment(memberData?.joining_date)

    return (
        <div>
            <div className="mb-4 flex flex-row justify-end">
                <Button>Add Membership +</Button>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-row justify-between">
                        <div>
                            <h2 className="text-3xl font-bold">{memberData.name}</h2>
                            <div>
                                <Badge>{memberData.bill_number}</Badge>
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
                    <h1 className="text-lg">
                        Memberships
                    </h1>
                </CardHeader>
                <CardContent>
                    {membershipsData.map(membership => {
                        return (
                            <div key={membership.id}>
                                <div className="w-full flex flex-row justify-between">
                                    <p>Start Date : {moment(membership.start_date).format("DD-MM-YYYY")}</p>
                                    <Badge>
                                        {`${membership.duration} Month`}
                                    </Badge>
                                </div>
                                <Separator className="mt-4 mb-4" />
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
