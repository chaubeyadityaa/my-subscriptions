import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import axios from "axios";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const response = await axios.get("https://api.github.com/user/repos", {
    headers: { Authorization: `token ${session.accessToken}` },
  });

  const repos = response.data.slice(0, 10); // first 10
  return new Response(JSON.stringify(repos));
}