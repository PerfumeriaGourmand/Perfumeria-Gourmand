import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettingsPublic } from "@/types";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings_public")
    .select("announcement_text, announcement_active")
    .eq("id", 1)
    .single<SiteSettingsPublic>();

  const hasAnnouncement = !!(settings?.announcement_active && settings.announcement_text);

  return (
    <>
      {hasAnnouncement && <AnnouncementBar text={settings!.announcement_text!} />}
      <Suspense fallback={null}>
        <Navbar hasAnnouncement={hasAnnouncement} />
      </Suspense>
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
