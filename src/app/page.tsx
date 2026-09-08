import {getUserId} from "@/lib/auth/session";import {transact} from "@/lib/repository/local";import {redirect} from "next/navigation";import {App} from "@/components/app";
export default async function Home(){const id=await getUserId();if(!id)redirect('/login');const onboarded=await transact(db=>db.users.find(x=>x.id===id)?.dealershipId);if(!onboarded)redirect('/onboarding');return <App/>}
