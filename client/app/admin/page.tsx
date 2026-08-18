import { redirect } from "next/navigation";

export default function AdminPage() {
  // Automatically redirect anyone trying to access /admin to /admin/dashboard
  redirect("/admin/dashboard");
}
