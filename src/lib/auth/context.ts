import {getUserId} from "./session";import {transact} from "@/lib/repository/local";
export async function requireContext(){const userId=await getUserId();if(!userId)throw new Error("UNAUTHENTICATED");return transact(db=>{const user=db.users.find(x=>x.id===userId);if(!user?.dealershipId)throw new Error("ONBOARDING_REQUIRED");return {userId,dealershipId:user.dealershipId}})}
