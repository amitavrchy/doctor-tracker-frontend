import { redirect } from "next/navigation";

export default function Home() {
  // TODO: send unauthenticated users to /login
  redirect("/dashboard");
}
