import { initialBoard } from "../../../../features/kanban/components/data";
import { Kanban } from "../../../../features/kanban/components/kanban";

export default function Page() {
  return (
    <div data-content-padding="false">
      <Kanban />
    </div>
  );
}
