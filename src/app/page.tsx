import { redirect } from "next/navigation";

export default function Home() {
  // Pengguna langung dilempar ke Music Library saat masuk ke web
  redirect("/music");
}
