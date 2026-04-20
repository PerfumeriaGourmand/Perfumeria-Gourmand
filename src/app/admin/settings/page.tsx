export const dynamic = "force-dynamic";
import SettingsClient from "./SettingsClient";
import { createAdminClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("id, store_name, store_description, logo_url, announcement_text, announcement_active, mp_public_key, instagram_url, facebook_url, tiktok_url, whatsapp_number, free_shipping_min, shipping_zones, low_stock_threshold, current_exchange_rate")
    .eq("id", 1)
    .single();

  return <SettingsClient initialSettings={settings ?? null} />;
}
