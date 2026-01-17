// frontend/src/lib/api.ts
export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function extractNestMessage(payload: unknown): string | null {
  // Nest geralmente retorna: { statusCode, message, error }
  if (!isRecord(payload)) return null;

  const msg = payload["message"];

  if (typeof msg === "string") return msg;

  if (Array.isArray(msg)) {
    const parts = msg.filter((x): x is string => typeof x === "string");
    if (parts.length) return parts.join(" | ");
  }

  // fallback: error string
  const err = payload["error"];
  if (typeof err === "string") return err;

  return null;
}

export function getErrorMessage(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error) return e.message;
  return "Erro inesperado";
}

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const headers = new Headers(options.headers);

  let body: BodyInit | undefined = undefined;

  if (options.body !== undefined) {
    // se for FormData, deixa passar sem mexer
    if (options.body instanceof FormData) {
      body = options.body;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.body);
    }
  }

  headers.set("Accept", "application/json");

  const res = await fetch(url, {
    ...options,
    headers,
    body,
  });

  // 204 (sem conteúdo)
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const payload: unknown = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const msgFromNest = extractNestMessage(payload);
    const msgFromText = typeof payload === "string" && payload.trim() ? payload : null;

    const msg = msgFromNest ?? msgFromText ?? `Erro HTTP ${res.status}`;
    throw new ApiError(msg, res.status, payload);
  }

  return payload as T;
}
