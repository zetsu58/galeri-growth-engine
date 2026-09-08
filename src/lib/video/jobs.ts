export type VideoJob={id:string;dealershipId:string;vehicleId:string;status:"queued"|"processing"|"completed"|"failed";provider:"mock"};
export function queueMockVideo(dealershipId:string,vehicleId:string):VideoJob { return {id:crypto.randomUUID(),dealershipId,vehicleId,status:"queued",provider:"mock"}; }
