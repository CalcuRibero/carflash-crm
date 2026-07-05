import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login");
  return <>Coming Soon</>;
}
