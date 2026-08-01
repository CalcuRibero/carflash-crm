import { TicketDetail } from "@/features/tickets";

interface TicketDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: TicketDetailPageProps) {

  const { id } = await params

  console.log(id)
  return (
    <div data-content-padding="false">
      <TicketDetail ticketId={id} />
    </div>
  );
}
