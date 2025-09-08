// Archivo: pages/api/debug-env.ts
// Endpoint para verificar variables de entorno en producción

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  return res.status(200).json(debugInfo);
}