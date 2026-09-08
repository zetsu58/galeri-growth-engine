export function GET(){return Response.json({status:"ok",mode:process.env.AI_PROVIDER??"mock"})}
