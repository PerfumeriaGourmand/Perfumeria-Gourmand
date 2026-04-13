export const dynamic = "force-dynamic";
import SettingsClient from "./SettingsClient";
import { createAdminClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createAdminClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return <SettingsClient initialSettings={settings ?? null} />;
}
