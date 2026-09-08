import { MockAIProvider } from "@/lib/ai/provider";
export async function POST(){return Response.json(await new MockAIProvider().generateSalesContent({brand:"BMW",model:"320i",trim:"M Sport",year:2022,mileage:48000,price:2150000,transmission:"Otomatik",fuel:"Benzin"}))}
