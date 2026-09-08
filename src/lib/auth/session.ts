import "server-only";import {cookies} from "next/headers";import {createHmac,timingSafeEqual} from "node:crypto";
const name="gge_demo_session";const secret=()=>process.env.SESSION_SECRET??"demo-only-change-in-production";
function sign(value:string){return createHmac("sha256",secret()).update(value).digest("hex")}
export async function createSession(userId:string){const value=`${userId}.${sign(userId)}`;(await cookies()).set(name,value,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*8})}
export async function getUserId(){const value=(await cookies()).get(name)?.value;if(!value)return null;const [id,sig]=value.split(".");if(!id||!sig)return null;const expected=Buffer.from(sign(id));const actual=Buffer.from(sig);return actual.length===expected.length&&timingSafeEqual(actual,expected)?id:null}
export async function clearSession(){(await cookies()).delete(name)}
