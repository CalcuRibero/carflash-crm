import { Chat } from "../../../features/chat/_components/chat";
import { conversations } from "../../../features/chat/_components/data";

export default function Page() {
  return <Chat conversations={conversations} />;
}
