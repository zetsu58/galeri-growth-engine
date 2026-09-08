export {localRepository as repository} from "./local";
export interface ProductionRepositoryBoundary { readonly provider:"supabase"; /* Implement with authenticated JWT + explicit tenant filters; RLS is defense-in-depth. */ }
