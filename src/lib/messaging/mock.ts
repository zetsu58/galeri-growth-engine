import { z } from "zod";
import { extractDemoSignals, scoreLead } from "../leads/scoring";
export const incomingMessageSchema = z.object({eventId:z.string().min(1).max(100), dealershipId:z.string().uuid(), from:z.string().min(5).max(30), text:z.string().min(1).max(4000)}).strict();
const processed = new Set<string>();
export function ingestMockMessage(input: unknown) {
 const message=incomingMessageSchema.parse(input); const key=`${message.dealershipId}:${message.eventId}`;
 if(processed.has(key)) return {duplicate:true}; processed.add(key);
 const signals=extractDemoSignals(message.text); const result=scoreLead(signals);
 return {duplicate:false, lead:{id:crypto.randomUUID(),name:"WhatsApp Müşterisi",...result,signals,status:result.classification==="HOT"?"HUMAN_REQUIRED":"AI_ACTIVE"}};
}
