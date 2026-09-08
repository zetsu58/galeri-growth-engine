export type Vehicle={id:string;dealershipId:string;brand:string;model:string;trim:string;year:number;mileage:number;price:number;minimumPrice?:number;transmission:string;fuel:string;color:string;condition:string;damageInfo:string;exchangeAvailable:boolean;financingInfo:string;notes:string;status:"draft"|"active"|"reserved"|"sold"|"archived";createdAt:string;media:Media[]};
export type Media={id:string;path:string;isCover:boolean;mime:string};
export type Content={id:string;vehicleId:string;createdAt:string;data:Record<string,string|string[]>};
export type Conversation={id:string;leadId:string;state:"AI_ACTIVE"|"HUMAN_REQUIRED"|"HUMAN_ACTIVE"|"RESOLVED";messages:{id:string;direction:"inbound"|"outbound";body:string;createdAt:string}[]};
export type Lead={id:string;dealershipId:string;phone:string;vehicleId:string;tradeIn?:string;visitIntent?:string;score:number;classification:"HOT"|"WARM"|"COLD";reason:string;conversationId:string};
export type VideoJob={id:string;vehicleId:string;status:"queued"|"processing"|"completed"|"failed";output?:string};
export type FollowUp={id:string;leadId:string;delayMinutes:number;status:"queued"|"cancelled";reason?:string};
export type Database={users:{id:string;email:string;dealershipId?:string}[];dealerships:{id:string;name:string;ownerId:string}[];vehicles:Vehicle[];contents:Content[];leads:Lead[];conversations:Conversation[];videoJobs:VideoJob[];followUps:FollowUp[];events:{dealershipId:string;eventId:string}[]};
