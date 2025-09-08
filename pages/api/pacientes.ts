// Archivo: pages/api/pacientes.ts
// API Route tradicional de Next.js para compatibilidad con Vercel

import { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Configurar CORS
  const origin = req.headers.origin;
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://dentalflow.vercel.app']
    : ['http://localhost:3000', 'http://localhost:9004'];
  
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  
  res.setHeader('Access-Control-Allow-Origin', isAllowedOrigin ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Construir URL con parámetros
    const url = new URL(API_URL);
    
    // Agregar todos los query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string') {
        url.searchParams.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      }
    });

    console.log('Fetching from Google Apps Script:', url.toString());

    // Hacer la petición a Google Apps Script
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Google Apps Script error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: 'Error from Google Apps Script',
        status: response.status,
        statusText: response.statusText
      });
    }

    const data = await response.json();
    console.log('Google Apps Script response:', data);

    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}