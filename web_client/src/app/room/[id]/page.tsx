export default function Page({ params }: { params: { id: string } }) {
  return <div>My Room: {params.id}</div>
}