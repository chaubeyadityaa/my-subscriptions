import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getAccessTokenFromRequest(req: NextRequest): Promise<string | null> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || typeof token.accessToken !== "string") {
    return null;
  }

  return token.accessToken;
}
