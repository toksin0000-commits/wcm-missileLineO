import conflicts from "@/data/conflicts.json";
import Timeline from "@/components/Timeline";
import AIChat from "@/components/AIChat";
import Link from "next/link";
import MiniMap from "@/components/MiniMap"; // ← OPRAVENO

interface ConflictPageProps {
  params: {
    id: string;
  };
}

export default function ConflictPage({ params }: ConflictPageProps) {
  const conflict = conflicts.find((c) => c.id === params.id);

  if (!conflict) {
    return (
      <main className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-2xl font-bold">Konflikt nenalezen</h1>
        <p className="text-gray-600 mt-2">
          Zadaný konflikt neexistuje nebo byl odstraněn.
        </p>
        <Link href="/conflicts" className="text-blue-600 underline mt-4 inline-block">
          Zpět na seznam konfliktů
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <Link href="/conflicts" className="text-blue-600 underline mb-6 inline-block">
        ← Zpět na seznam konfliktů
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{conflict.flag}</span>
        <h1 className="text-3xl font-bold">{conflict.name}</h1>
      </div>

      <p className="text-gray-600 mb-6">{conflict.summary_short}</p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Region</h2>
        <p className="text-gray-700">{conflict.region}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Detailní kontext</h2>
        <p className="text-gray-700">{conflict.summary_long}</p>
      </div>

      {/* MINI MAPKA */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Mapa oblasti</h2>
        <MiniMap area={conflict.map_area} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Humanitární dopady</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500">Uprchlíci</div>
            <div className="text-xl font-bold">
              {conflict.humanitarian.refugees.toLocaleString()}
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500">Vnitřně vysídlení</div>
            <div className="text-xl font-bold">
              {conflict.humanitarian.idps.toLocaleString()}
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500">Civilní oběti</div>
            <div className="text-xl font-bold">
              {conflict.humanitarian.civilian_casualties.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Vývoj konfliktu</h2>
        <Timeline items={conflict.timeline} />
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">AI Analýza</h2>
        <AIChat conflictId={conflict.id} />
      </div>

      <Link
        href="/"
        className="mt-8 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Zobrazit na mapě
      </Link>
    </main>
  );
}
