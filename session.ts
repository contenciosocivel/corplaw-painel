// src/lib/session.ts
import { getIronSession, IronSession, IronSessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  autenticado?: boolean
}

const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET ?? 'fallback_secret_minimo_32_chars_aqui',
  cookieName: 'corplaw_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 horas
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}
