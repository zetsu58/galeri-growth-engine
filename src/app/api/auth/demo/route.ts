import {createSession} from "@/lib/auth/session";export async function POST(){await createSession("demo-user");return Response.json({ok:true})}
