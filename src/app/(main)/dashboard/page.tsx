import { TicketBoard, type TicketColumn } from "@/../components/ticket-board";

const sampleColumns: TicketColumn[] = [
  {
    id: "todo",
    title: "Backlog",
    description: "Ideas and planned work",
    tickets: [
      {
        id: "ticket-1",
        title: "Refresh analytics cards",
        description: "Improve dashboard readability",
        priority: "High",
        assignee: "Mina",
        estimate: "2d",
      },
      {
        id: "ticket-2",
        title: "Improve onboarding flow",
        description: "Simplify first-run steps",
        priority: "Medium",
        assignee: "Alec",
        estimate: "1d",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In progress",
    description: "Currently being built",
    tickets: [
      {
        id: "ticket-3",
        title: "Audit permission rules",
        description: "Check access for support users",
        priority: "High",
        assignee: "Noor",
        estimate: "3d",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    description: "Finished and verified",
    tickets: [
      {
        id: "ticket-4",
        title: "Ship monthly report",
        description: "Publish KPI export",
        priority: "Low",
        assignee: "Kai",
        estimate: "4h",
      },
    ],
  },
];

export default function Page() {
  return (
    <main className="p-6">
      <TicketBoard columns={sampleColumns} />
    </main>
  );
}
