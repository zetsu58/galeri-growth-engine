import { z } from "zod";

export const salesContentSchema = z.object({
  listingTitle:z.string(), listingDescription:z.string(), shortDescription:z.string(),
  instagramCaption:z.string(), storyText:z.string(), reelHook:z.string(), reelScript:z.string(),
  cta:z.string(), hashtags:z.array(z.string()), whatsappDescription:z.string(),
});
export type SalesContent = z.infer<typeof salesContentSchema>;
export type VehicleFacts = { brand:string; model:string; trim:string; year:number; mileage:number; price:number; transmission:string; fuel:string };
export interface AIProvider { generateSalesContent(vehicle: VehicleFacts): Promise<SalesContent> }
export class MockAIProvider implements AIProvider {
  async generateSalesContent(v: VehicleFacts) {
    const name = `${v.year} ${v.brand} ${v.model} ${v.trim}`;
    return salesContentSchema.parse({listingTitle:`${name} | ${v.mileage.toLocaleString("tr-TR")} km`,listingDescription:`Growth Motors güvencesiyle ${name}. ${v.transmission}, ${v.fuel}. Fiyat: ${v.price.toLocaleString("tr-TR")} TL.`,shortDescription:`${name}, ${v.mileage.toLocaleString("tr-TR")} km.`,instagramCaption:`Yolların yeni yıldızı: ${name}.`,storyText:`${v.brand} ${v.model}\n${v.price.toLocaleString("tr-TR")} TL`,reelHook:"Bu BMW'yi kaçırmayın!",reelScript:`${name} şimdi Growth Motors'ta. Bilgi için bize ulaşın.`,cta:"Bilgi ve randevu için WhatsApp'tan yazın.",hashtags:["#GrowthMotors",`#${v.brand}`,"#Otomobil"],whatsappDescription:`${name} satışta. Fiyat ${v.price.toLocaleString("tr-TR")} TL. Detaylar için yazabilirsiniz.`});
  }
}
