export default function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 flex items-center justify-center bg-[#0a0a0a] text-gold text-xs font-medium tracking-wide px-4 text-center">
      <p className="truncate">{text}</p>
    </div>
  );
}
