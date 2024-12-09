import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
    const cookieStore = (await cookies());
    const token = cookieStore.get("token")?.value;

    if (token) {
        redirect('/members')
    }

    return children
}