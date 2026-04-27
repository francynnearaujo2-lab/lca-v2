import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const key = process.env.GROQ_API_KEY || ''
  return NextResponse.json({
    keyLength: key.length,
    keyStart: key.substring(0, 8),
    keyEnd: key.substring(key.length - 4),
    hasSpaces: key.includes(' '),
    hasNewline: key.includes('\n'),
  })
}
