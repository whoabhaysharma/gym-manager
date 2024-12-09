import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";

export default async function Page({ params }) {
    const memberId = (await params).memberId;

    return (
        <div>
            <Card>
                <CardHeader>
                    <h1 className="text-3xl font-bold">Abhay</h1>
                    <div>
                        <Badge>3245</Badge>
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}