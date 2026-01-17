"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, getErrorMessage } from "@/lib/api";

type Medico = {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
};

function isMedico(x: unknown): x is Medico {
  if (!x || typeof x !== "object") return false;
  const obj = x as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.nome === "string" &&
    typeof obj.crm === "string" &&
    typeof obj.especialidade === "string"
  );
}

export default function MedicosPage() {
  const [items, setItems] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  const [editing, setEditing] = useState<Medico | null>(null);

  const canCreate = useMemo(
    () => Boolean(nome.trim() && crm.trim() && especialidade.trim()),
    [nome, crm, especialidade]
  );

  async function load() {
    setErr(null);
    setLoading(true);

    try {
      const data = await api<unknown>("/medicos");

      if (!Array.isArray(data)) {
        setItems([]);
        throw new Error("Resposta inválida da API (era esperado um array).");
      }

      setItems(data.filter(isMedico));
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function create() {
    setErr(null);
    setLoading(true);

    try {
      const created = await api<unknown>("/medicos", {
        method: "POST",
        body: { nome, crm, especialidade },
      });

      if (!isMedico(created)) {
        throw new Error("API retornou um médico inválido.");
      }

      setNome("");
      setCrm("");
      setEspecialidade("");

      // mantém lista sempre consistente (inclusive se backend ordenar diferente)
      await load();
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setErr(null);
    setLoading(true);

    try {
      await api<void>(`/medicos/${id}`, { method: "DELETE" });
      await load();
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function update(m: Medico) {
    setErr(null);
    setLoading(true);

    try {
      const updated = await api<unknown>(`/medicos/${m.id}`, {
        method: "PATCH",
        body: { nome: m.nome, crm: m.crm, especialidade: m.especialidade },
      });

      if (!isMedico(updated)) {
        // alguns backends retornam só {count} etc; então recarrega e pronto
        await load();
      } else {
        setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      }

      setEditing(null);
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Médicos</h1>
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
          <h2 className="text-lg font-medium">Cadastrar médico</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="CRM"
              value={crm}
              onChange={(e) => setCrm(e.target.value)}
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="Especialidade"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
            />
          </div>

          <button
            className="mt-4 rounded-lg bg-black px-4 py-2 text-white disabled:opacity-40"
            disabled={!canCreate || loading}
            onClick={() => void create()}
          >
            {loading ? "Aguarde..." : "Criar"}
          </button>
        </section>

        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Lista</h2>
            <button
              className="rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-40"
              disabled={loading}
              onClick={() => void load()}
            >
              Recarregar
            </button>
          </div>

          {loading ? (
            <div className="mt-4 text-sm text-zinc-600">Carregando...</div>
          ) : items.length === 0 ? (
            <div className="mt-4 text-sm text-zinc-600">
              Nenhum médico cadastrado.
            </div>
          ) : (
            <div className="mt-4 overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-zinc-600">
                    <th className="border-b p-2">Nome</th>
                    <th className="border-b p-2">CRM</th>
                    <th className="border-b p-2">Especialidade</th>
                    <th className="border-b p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50">
                      <td className="border-b p-2">{m.nome}</td>
                      <td className="border-b p-2">{m.crm}</td>
                      <td className="border-b p-2">{m.especialidade}</td>
                      <td className="border-b p-2">
                        <div className="flex gap-2">
                          <button
                            className="rounded-lg border px-3 py-1 hover:bg-white disabled:opacity-40"
                            disabled={loading}
                            onClick={() => setEditing(m)}
                          >
                            Editar
                          </button>
                          <button
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100 disabled:opacity-40"
                            disabled={loading}
                            onClick={() => void remove(m.id)}
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {editing && (
          <EditModal
            medico={editing}
            onClose={() => setEditing(null)}
            onSave={(m) => void update(m)}
            busy={loading}
          />
        )}
      </div>
    </main>
  );
}

function EditModal({
  medico,
  onClose,
  onSave,
  busy,
}: {
  medico: Medico;
  onClose: () => void;
  onSave: (m: Medico) => void;
  busy: boolean;
}) {
  const [m, setM] = useState<Medico>(medico);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Editar médico</h3>
          <button className="text-sm text-zinc-600" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <input
            className="rounded-lg border px-3 py-2"
            value={m.nome}
            onChange={(e) => setM({ ...m, nome: e.target.value })}
          />
          <input
            className="rounded-lg border px-3 py-2"
            value={m.crm}
            onChange={(e) => setM({ ...m, crm: e.target.value })}
          />
          <input
            className="rounded-lg border px-3 py-2"
            value={m.especialidade}
            onChange={(e) => setM({ ...m, especialidade: e.target.value })}
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="rounded-lg border px-4 py-2 disabled:opacity-40"
            disabled={busy}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-40"
            disabled={busy}
            onClick={() => onSave(m)}
          >
            {busy ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
