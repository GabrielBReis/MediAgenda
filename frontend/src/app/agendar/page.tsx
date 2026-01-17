'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

type Medico = {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
};

type CreateConsultaPayload = {
  medicoId: string;
  paciente: string;
  dataHora: string; // ISO
};

export default function AgendarPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicoId, setMedicoId] = useState('');
  const [paciente, setPaciente] = useState('');
  const [dataHoraLocal, setDataHoraLocal] = useState(''); // datetime-local
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => {
    api<Medico[]>('/medicos')
      .then((list) => {
        setMedicos(list);
        if (list[0]?.id) setMedicoId(list[0].id);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Erro'));
  }, []);

  const canSubmit = useMemo(() => {
    return Boolean(medicoId && paciente.trim() && dataHoraLocal);
  }, [medicoId, paciente, dataHoraLocal]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setOk('');

    try {
      const iso = new Date(dataHoraLocal).toISOString();

      const payload: CreateConsultaPayload = {
        medicoId,
        paciente: paciente.trim(),
        dataHora: iso,
      };

      await api('/consultas', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setOk('Consulta agendada com sucesso!');
      setPaciente('');
      setDataHoraLocal('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao agendar');
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Novo Agendamento</h1>
        <Link href="/" style={{ textDecoration: 'none' }}>
          ← Voltar
        </Link>
      </header>

      <form onSubmit={onSubmit} style={{ marginTop: 18, display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          Médico
          <select
            value={medicoId}
            onChange={(e) => setMedicoId(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }}
          >
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} — {m.especialidade} (CRM {m.crm})
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          Paciente
          <input
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            placeholder="Nome do paciente"
            style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }}
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          Data e hora
          <input
            type="datetime-local"
            value={dataHoraLocal}
            onChange={(e) => setDataHoraLocal(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }}
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #ddd',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          Agendar
        </button>

        {ok && <p style={{ color: 'green' }}>{ok}</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </main>
  );
}
