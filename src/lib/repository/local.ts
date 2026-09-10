import "server-only";
import {mkdir,readFile,rename,writeFile} from "node:fs/promises";
import path from "node:path";
import type {Database,Vehicle} from "@/lib/domain";
const root=process.env.DEMO_DATA_DIR??path.join(process.cwd(),".data"); const file=path.join(root,"demo.json");
const empty=():Database=>({users:[{id:"demo-user",email:"demo@galeri.local"}],dealerships:[],vehicles:[],contents:[],leads:[],conversations:[],videoJobs:[],followUps:[],events:[]});
let chain=Promise.resolve();
async function read():Promise<Database>{try{return JSON.parse(await readFile(file,"utf8")) as Database}catch(error){if((error as NodeJS.ErrnoException).code==="ENOENT")return empty();throw error}}
async function write(db:Database){await mkdir(root,{recursive:true});const tmp=`${file}.${process.pid}.tmp`;await writeFile(tmp,JSON.stringify(db,null,2),{mode:0o600});await rename(tmp,file)}
export async function transact<T>(fn:(db:Database)=>T|Promise<T>):Promise<T>{let result!:T;const run=async()=>{const db=await read();result=await fn(db);await write(db)};chain=chain.then(run,run);await chain;return result}
export async function view<T>(tenant:string,fn:(db:Database)=>T):Promise<T>{return fn(await readTenant(tenant))}
async function readTenant(tenant:string){const db=await read();const vehicleIds=new Set(db.vehicles.filter(x=>x.dealershipId===tenant).map(x=>x.id));const leadIds=new Set(db.leads.filter(x=>x.dealershipId===tenant).map(x=>x.id));return {...db,dealerships:db.dealerships.filter(x=>x.id===tenant),vehicles:db.vehicles.filter(x=>x.dealershipId===tenant),contents:db.contents.filter(x=>vehicleIds.has(x.vehicleId)),videoJobs:db.videoJobs.filter(x=>vehicleIds.has(x.vehicleId)),leads:db.leads.filter(x=>x.dealershipId===tenant),conversations:db.conversations.filter(x=>leadIds.has(x.leadId)),followUps:db.followUps.filter(x=>leadIds.has(x.leadId)),events:db.events.filter(x=>x.dealershipId===tenant)}}
export function requireVehicle(db:Database,tenant:string,id:string):Vehicle{const vehicle=db.vehicles.find(x=>x.id===id&&x.dealershipId===tenant);if(!vehicle)throw new Error("NOT_FOUND");return vehicle}
export const localRepository={transact,view,requireVehicle};
