export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold">MediAgenda</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/medicos"
            className="rounded-xl border bg-white p-5 shadow-sm hover:bg-zinc-50"
          >
            <div className="text-lg font-medium">Médicos</div>
            <div className="text-sm text-zinc-600">CRUD de médicos</div>
          </a>

          <a
            href="/consultas"
            className="rounded-xl border bg-white p-5 shadow-sm hover:bg-zinc-50"
          >
            <div className="text-lg font-medium">Consultas</div>
            <div className="text-sm text-zinc-600">Agendar e listar consultas</div>
          </a>
        </div>
      </div>
    </main>
  );
}
