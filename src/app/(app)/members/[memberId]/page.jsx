import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import supabase from "@/lib/supabase/client";
import MemberDetail from "./memberDetail";

export default async function Page({ params }) {
    const memberId = (await params).memberId;

    // Fetch the member's data and memberships from Supabase
    // const getMemberData = async (id) => {
    //     try {
    //         // Fetch the member details
    //         const { data: memberData, error: memberError } = await supabase
    //             .from("members")
    //             .select("*")

    //         console.log(memberData, 'MEMBER DATA')

    //         if (memberError) throw memberError;

    //         // Fetch the memberships for the member
    //         const { data: membershipsData, error: membershipsError } = await supabase
    //             .from("memberships")
    //             .select("*")
    //             .eq("member_id", memberData.id);

    //         if (membershipsError) throw membershipsError;

    //         return { memberData, membershipsData };
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //         return { memberData: null, membershipsData: [] };
    //     }
    // };

    // const { memberData, membershipsData } = await getMemberData(memberId);

    return (
        <MemberDetail id={memberId} />
    );
}
