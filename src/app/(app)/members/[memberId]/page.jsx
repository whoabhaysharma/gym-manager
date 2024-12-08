export default async function Page({ params }) {
    const id = (await params).memberId
    return (
        <div>
            hello {id}
        </div>
    )
}