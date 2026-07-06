import { users } from "../../../../features/users/components/data";
import { Users } from "../../../../features/users/components/users";

export default function Page() {
  return <Users users={users} />;
}
