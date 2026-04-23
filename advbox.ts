// src/lib/advbox.ts
// Cliente da API ADVBOX — busca todos os processos com paginação automática

const BASE = 'https://app.advbox.com.br/api/v1'
const TOKEN = process.env.ADVBOX_TOKEN!

export interface AdvboxLawsuit {
  id: number
  process_number: string | null
  protocol_number: string | null
  folder: string | null
  process_date: string | null
  fees_expec: number | null
  fees_money: number | null
  contingency: number | null
  type: string | null
  group: string | null
  responsible: string | null
  stage: string | null
  step: string | null
  notes: string | null
  status_closure: string | null
  exit_production: string | null
  exit_execution: string | null
  created_at: string
  customers: Array<{
    customer_id: number
    name: string
    identification: string | null
    origin: string | null
  }>
}

export interface AdvboxResponse {
  offset: number
  limit: number
  totalCount: number
  data: AdvboxLawsuit[]
}

async function fetchPage(offset: number, limit = 100): Promise<AdvboxResponse> {
  const url = `${BASE}/lawsuits?limit=${limit}&offset=${offset}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    // Cache de 5 minutos no servidor
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    throw new Error(`ADVBOX API erro ${res.status}: ${await res.text()}`)
  }

  return res.json()
}

// Busca TODOS os processos usando paginação automática
export async function fetchAllLawsuits(): Promise<AdvboxLawsuit[]> {
  const first = await fetchPage(0)
  const total = first.totalCount
  const all = [...first.data]

  // Busca páginas restantes em paralelo
  if (total > 100) {
    const offsets = []
    for (let o = 100; o < total; o += 100) offsets.push(o)
    const pages = await Promise.all(offsets.map(o => fetchPage(o)))
    pages.forEach(p => all.push(...p.data))
  }

  return all
}

// Converte o formato da API para o formato que o painel já usa
export function normalizeLawsuit(p: AdvboxLawsuit) {
  const clientNames = p.customers.map(c => c.name).join(';')
  const valor = p.fees_expec ?? p.fees_money ?? p.contingency ?? 0

  // Calcula dias parado (dias desde a última movimentação)
  const hoje = new Date()
  const criado = new Date(p.created_at)
  const diasTotal = Math.floor((hoje.getTime() - criado.getTime()) / 86400000)

  // Extrai tribunal a partir do número do processo (formato CNJ: NNNNNNN-DD.AAAA.J.TT.OOOO)
  let tribunal = 'N/D'
  if (p.process_number) {
    const partes = p.process_number.split('.')
    if (partes.length >= 4) {
      const j = partes[2]
      const tt = partes[3]
      const tribunalMap: Record<string, string> = {
        '1': 'STF', '2': 'CNJ', '3': 'STJ', '4': 'JF',
        '5': 'TRT', '6': 'TRE', '7': 'TRM', '8': 'TJRN',
      }
      if (j === '8') {
        // Justiça Estadual — identifica pelo código do estado
        const estadoMap: Record<string, string> = {
          '20': 'TJRN', '26': 'TJPE', '13': 'TJMG', '21': 'TJRS',
          '24': 'TJSC', '19': 'TJSP', '15': 'TJPB', '09': 'TJGO',
          '07': 'TJCE', '14': 'TJRJ', '05': 'TJBA', '01': 'TJDF',
          '02': 'TJAL', '23': 'TJSE', '11': 'TJES',
        }
        tribunal = estadoMap[tt] ?? `TJ${tt}`
      } else if (j === '4') {
        tribunal = `TRF${tt}`
      } else if (j === '5') {
        tribunal = `TRT${tt}`
      } else {
        tribunal = tribunalMap[j] ?? `J${j}`
      }
    }
  }

  return {
    c: clientNames,
    pc: '', // parte contrária não vem da API de listagem
    g: p.group ?? 'N/D',
    tp: p.type ?? 'N/D',
    f: p.step ?? 'N/D',
    et: p.stage ?? 'N/D',
    n: p.process_number ?? '',
    tr: tribunal,
    cm: '',
    va: '',
    dr: p.process_date ? p.process_date.split('-').reverse().join('/') : '',
    rs: p.responsible ?? '',
    vl: valor > 0 ? `R$${valor.toFixed(2)}` : 'nan',
    vn: valor,
    um: '',
    dm: p.status_closure ?? p.exit_production ?? '',
    ds: diasTotal,
    arq: !!(p.status_closure || p.exit_production || p.exit_execution),
    tu: diasTotal,
  }
}
