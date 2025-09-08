// Archivo: src/app/api/debug-env/route.ts
// Endpoint para verificar variables de entorno en producción

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Información de debug
  const debugInfo = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
    hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL,
    apiUrlLength: process.env.NEXT_PUBLIC_API_URL?.length || 0,
    apiUrlPreview: process.env.NEXT_PUBLIC_API_URL ? 
      process.env.NEXT_PUBLIC_API_URL.substring(0, 50) + '...' : 'undefined',
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.startsWith('NEXT_PUBLIC_') || 
      key.startsWith('VERCEL_') ||
      key === 'NODE_ENV'
    ).sort()
  };

  return NextResponse.json(debugInfo);
}