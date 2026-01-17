"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type Medico = {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
};

type Consulta = {
  id: string;
  medicoId: string;
  paciente: string;
  dataHora: string; // ISO
  medico?: Medico;
};

export default function ConsultasPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [medicoId, setMedicoId] = useState("");
  const [paciente, setPaciente] = useState("");
  const [dataHoraLocal, setDataHoraLocal] = useState("");

  const canCreate = useMemo(
    () => medicoId && paciente.trim() && dataHoraLocal,
    [medicoId, paciente, dataHoraLocal],
  );

  async function loadAll() {
    setErr(null);
    setLoading(true);
    try {
      const [m, c] = await Promise.all([
        api<Medico[]>("/medicos"),
        api<Consulta[]>("/consultas"),
      ]);
      setMedicos(m);
      setConsultas(c);

      if (!medicoId && m.length) setMedicoId(m[0].id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toISOStringFromLocal(dtLocal: string) {
    const d = new Date(dtLocal);
    return d.toISOString();
  }

  async function create() {
    setErr(null);
    try {
      const created = await api<Consulta>("/consultas", {
        method: "POST",
        body: {
          medicoId,
          paciente,
          dataHora: toISOStringFromLocal(dataHoraLocal),
        },
      });

      setConsultas((prev) => [created, ...prev]);
      setPaciente("");
      setDataHoraLocal("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao criar consulta");
    }
  }

  async function remove(id: string) {
    setErr(null);
    try {
      await api<void>(`/consultas/${id}`, { method: "DELETE" });
      setConsultas((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao deletar consulta");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Consultas</h1>
          <Link className="text-sm text-zinc-600 hover:underline" href="/">
            Voltar
          </Link>
        </div>

        {err && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-medium">Agendar consulta</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <select
              className="rounded-lg border px-3 py-2"
              value={medicoId}
              onChange={(e) => setMedicoId(e.target.value)}
            >
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} ({m.especialidade})
                </option>
              ))}
            </select>

            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Paciente"
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
            />

            <input
              className="rounded-lg border px-3 py-2"
              type="datetime-local"
              value={dataHoraLocal}
              onChange={(e) => setDataHoraLocal(e.target.value)}
            />
          </div>

          <button
            className="mt-4 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-40"
            disabled={!canCreate}
            onClick={() => void create()}
          >
            Agendar
          </button>
        </section>

        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Lista</h2>
            <button
              className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50"
              onClick={() => void loadAll()}
            >
              Recarregar
            </button>
          </div>

          {loading ? (
            <div className="mt-4 text-sm text-zinc-600">Carregando...</div>
          ) : consultas.length === 0 ? (
            <div className="mt-4 text-sm text-zinc-600">
              Nenhuma consulta cadastrada.
            </div>
          ) : (
            <div className="mt-4 overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-zinc-600">
                    <th className="border-b p-2">Data/Hora</th>
                    <th className="border-b p-2">Paciente</th>
                    <th className="border-b p-2">Médico</th>
                    <th className="border-b p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {consultas.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-50">
                      <td className="border-b p-2">
                        {new Date(c.dataHora).toLocaleString()}
                      </td>
                      <td className="border-b p-2">{c.paciente}</td>
                      <td className="border-b p-2">
                        {c.medico
                          ? `${c.medico.nome} (${c.medico.especialidade})`
                          : c.medicoId}
                      </td>
                      <td className="border-b p-2">
                        <button
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100"
                          onClick={() => void remove(c.id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
