import Image from "next/image";
import EntriesListDisplay from "@/components/EntriesListDisplay";
export default function Home() {
  return (
    <div className="bg-zinc-950">
      <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <EntriesListDisplay />
      </div>
    </div>
  );
}
