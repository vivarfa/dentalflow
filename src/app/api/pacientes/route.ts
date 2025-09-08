// Archivo: src/app/api/pacientes/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

/**
 * =================================================================
 *  LÍNEA MÁGICA #1: LA SOLUCIÓN PRINCIPAL
 *  Esto fuerza a toda la ruta a ser dinámica. Next.js ejecutará este
 *  código en CADA petición, en lugar de devolver una respuesta
 *  guardada en caché.
 * =================================================================
 */
export const dynamic = 'force-dynamic';

// --- MANEJADOR DE PETICIONES GET (Leer y Buscar) ---
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Construimos la URL para Google Apps Script directamente desde los parámetros
    const googleScriptUrl = `${API_URL}?${searchParams.toString()}`;

    console.log('Proxying GET request to:', googleScriptUrl); 

    const response = await fetch(googleScriptUrl, {
      /**
       * =================================================================
       *  LÍNEA MÁGICA #2: DOBLE SEGURO
       *  Esto le dice específicamente a esta petición fetch que no
       *  guarde ni utilice ninguna caché.
       * =================================================================
       */
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Apps Script response not ok:', response.status, errorText);
      return NextResponse.json(
        { error: `Google Apps Script error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


// --- MANEJADOR DE PETICIONES POST (Crear, Actualizar, Eliminar) ---
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Proxying POST request to Google Apps Script:', body);

    // El Google Apps Script que te proporcioné devuelve JSON directamente,
    // por lo que no es necesario manejar redirecciones (302).
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Apps Script POST response not ok:', response.status, errorText);
      return NextResponse.json(
        { error: `Google Apps Script error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Proxy API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}