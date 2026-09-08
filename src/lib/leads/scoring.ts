import { z } from "zod";

export const extractedSignalsSchema = z.object({
  vehicleSpecified: z.boolean(), contactAvailable: z.boolean(), budgetMentioned: z.boolean(),
  tradeInMentioned: z.boolean(), timelineWithinSevenDays: z.boolean(), wantsAppointment: z.boolean(),
  todayIntent: z.boolean(), repeatedEngagement: z.boolean(), negativeIntent: z.boolean(),
  tradeInVehicle: z.string().max(120).optional(),
});
export type LeadSignals = z.infer<typeof extractedSignalsSchema>;
export type LeadClassification = "HOT" | "WARM" | "COLD";

const weights: Record<Exclude<keyof LeadSignals, "tradeInVehicle">, number> = {
  vehicleSpecified: 10, contactAvailable: 10, budgetMentioned: 10, tradeInMentioned: 15,
  timelineWithinSevenDays: 20, wantsAppointment: 20, todayIntent: 15,
  repeatedEngagement: 5, negativeIntent: -25,
};

export function scoreLead(signals: LeadSignals) {
  const parsed = extractedSignalsSchema.parse(signals);
  const contributions = Object.entries(weights)
    .filter(([signal]) => parsed[signal as keyof LeadSignals] === true)
    .map(([signal, points]) => ({ signal, points }));
  const score = Math.max(0, Math.min(100, contributions.reduce((sum, item) => sum + item.points, 0)));
  const classification: LeadClassification = score >= 70 ? "HOT" : score >= 40 ? "WARM" : "COLD";
  return { score, classification, contributions, reason: contributions.map(x => `${x.signal} (${x.points > 0 ? "+" : ""}${x.points})`).join(", ") };
}

export function extractDemoSignals(message: string): LeadSignals {
  const normalized = message.toLocaleLowerCase("tr-TR");
  const today = /bugün|hemen/.test(normalized);
  return {
    vehicleSpecified: /bmw|320i/.test(normalized), contactAvailable: true,
    budgetMentioned: /₺|tl|milyon|bin/.test(normalized), tradeInMentioned: /takas/.test(normalized),
    timelineWithinSevenDays: today || /yarın|hafta/.test(normalized),
    wantsAppointment: /gelebilirim|randevu|uğray/.test(normalized), todayIntent: today,
    repeatedEngagement: false, negativeIntent: /istemiyorum|ilgilenmiyorum/.test(normalized),
    tradeInVehicle: normalized.match(/(20\d{2}\s+[a-zçğıöşü]+)/i)?.[1],
  };
}
