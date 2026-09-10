import { queueMockVideo } from "@/lib/video/jobs";
export async function POST(){return Response.json(queueMockVideo("00000000-0000-4000-8000-000000000001","00000000-0000-4000-8000-000000000002"),{status:202})}
