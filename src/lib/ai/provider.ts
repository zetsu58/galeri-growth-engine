import { z } from "zod";

export const salesContentSchema = z.object({
  listingTitle:z.string().min(5).max(140), listingDescription:z.string().min(20).max(5000), shortDescription:z.string().min(5).max(500),
  instagramCaption:z.string().min(5).max(2200), storyText:z.string().min(3).max(500), reelHook:z.string().min(3).max(200), reelScript:z.string().min(10).max(3000),
  cta:z.string().min(3).max(300), hashtags:z.array(z.string().regex(/^#[\p{L}\p{N}_]+$/u)).max(20), whatsappDescription:z.string().min(5).max(2000),
}).strict();
export type SalesContent = z.infer<typeof salesContentSchema>;
export type VehicleFacts = { brand:string; model:string; trim:string; year:number; mileage:number; price:number; transmission:string; fuel:string };
export interface AIProvider { generateSalesContent(vehicle: VehicleFacts): Promise<SalesContent> }
export class MockAIProvider implements AIProvider {
  async generateSalesContent(v: VehicleFacts) {
    const name = `${v.year} ${v.brand} ${v.model} ${v.trim}`;
    return salesContentSchema.parse({listingTitle:`${name} | ${v.mileage.toLocaleString("tr-TR")} km`,listingDescription:`Growth Motors güvencesiyle ${name}. ${v.transmission}, ${v.fuel}. Fiyat: ${v.price.toLocaleString("tr-TR")} TL.`,shortDescription:`${name}, ${v.mileage.toLocaleString("tr-TR")} km.`,instagramCaption:`Yolların yeni yıldızı: ${name}.`,storyText:`${v.brand} ${v.model}\n${v.price.toLocaleString("tr-TR")} TL`,reelHook:"Bu BMW'yi kaçırmayın!",reelScript:`${name} şimdi Growth Motors'ta. Bilgi için bize ulaşın.`,cta:"Bilgi ve randevu için WhatsApp'tan yazın.",hashtags:["#GrowthMotors",`#${v.brand}`,"#Otomobil"],whatsappDescription:`${name} satışta. Fiyat ${v.price.toLocaleString("tr-TR")} TL. Detaylar için yazabilirsiniz.`});
  }
}
