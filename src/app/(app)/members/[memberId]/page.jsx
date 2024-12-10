import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { startCase, toLower } from "lodash";
import { cookies } from 'next/headers';

export default async function MemberDetail({ params }) {
    const id = (await params).memberId;
    const cookiesList = await cookies();

    let memberData, membershipsData;

    try {
        const memberResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/members/${id}`, {
            headers: {
                'Cookie': cookiesList.toString()
            }
        });

        memberData = await memberResponse.json();

        const membershipsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/members/${memberData.member.id}/memberships`, {
            headers: {
                'Cookie': cookiesList.toString()
            }
        });

        membershipsData = await membershipsResponse.json();

    } catch (err) {
        return <div>Error: {err.message}</div>;
    }

    const mom = moment(memberData.member.joining_date)

    return (
        <div>
            <div className="mb-4 flex flex-row justify-end">
                <Button>Add Membership +</Button>
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