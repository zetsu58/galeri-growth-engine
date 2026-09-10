import {z} from "zod";
export const incomingMessageSchema=z.object({eventId:z.string().min(1).max(100),dealershipId:z.string().uuid(),from:z.string().min(5).max(30),text:z.string().min(1).max(4000)}).strict();
export type IncomingMessage=z.infer<typeof incomingMessageSchema>;
export interface MessagingProvider{normalize(input:unknown):Omit<IncomingMessage,"dealershipId">}
export class MockWhatsAppProvider implements MessagingProvider{normalize(input:unknown){return incomingMessageSchema.omit({dealershipId:true}).parse(input)}}
