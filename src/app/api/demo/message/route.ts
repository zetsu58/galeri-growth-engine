import { ingestMockMessage } from "@/lib/messaging/mock";
import { ZodError } from "zod";
export async function POST(request:Request){try{return Response.json(ingestMockMessage(await request.json()),{status:201})}catch(error){return Response.json({error:error instanceof ZodError?"Geçersiz mesaj":"İşlem başarısız"},{status:400})}}
