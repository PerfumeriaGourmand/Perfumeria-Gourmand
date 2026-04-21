export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/supabase/server";
import CouponsClient from "./CouponsClient";
import type { Coupon } from "@/types";

export default async function AdminCouponsPage() {
  const supabase = await createAdminClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return <CouponsClient initialCoupons={(coupons as Coupon[]) ?? []} />;
}
