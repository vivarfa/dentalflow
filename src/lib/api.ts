// Archivo: src/lib/api.ts (VERSIÓN CORREGIDA Y SIMPLIFICADA)

import type { Patient } from "@/types";

// Usar el proxy interno en lugar de la URL directa
const API_URL = '/api/proxy';
const IS_CLIENT = typeof window !== 'undefined';
const BASE_URL = IS_CLIENT ? window.location.origin : 'http://localhost:9004';
const FULL_API_URL = IS_CLIENT ? API_URL : `${BASE_URL}${API_URL}`;

/**
 * Función centralizada para realizar peticiones a la API.
 * La opción { cache: 'no-store' } es la clave para resolver el problema.
 * Le dice a Next.js que NUNCA almacene en caché la respuesta de esta petición en el servidor.
 */
async function fetchAPI(url: string, returnArrayOnError = true) {
    try {
        // Crear AbortController con timeout de 30 segundos para Google Apps Script
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 30000);
        
        const response = await fetch(url, {
            cache: 'no-store', // ¡ESTA ES LA LÍNEA MÁS IMPORTANTE!
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: `Error en la API: ${response.statusText}` }));
            throw new Error(errorBody.message || `Error en la API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message || 'Ocurrió un error en la API');
        }
        
        // La respuesta de Google ya tiene una propiedad "data"
        return data.data; 

    } catch (error) {
        console.error("Error en fetchAPI:", error);
        if (error.name === 'AbortError') {
            console.error('Solicitud abortada por timeout');
        }
        // Devuelve el tipo de dato esperado en caso de error para no romper la UI.
        return returnArrayOnError ? [] : null;
    }
}


// --- FUNCIONES QUE USAN fetchAPI ---
// No necesitan cambios, ya que ahora se benefician automáticamente de la corrección en fetchAPI.

/**
 * Obtiene todos los pacientes con su próxima cita.
 * Siempre traerá datos frescos gracias a la nueva configuración de fetchAPI.
 */
export async function getPacientesWithAppointments(): Promise<Patient[]> {
    const url = `${FULL_API_URL}?action=getPacientesWithAppointments`;
    return fetchAPI(url, true); // El segundo parámetro es true por si hay un error, devuelve un array vacío.
}

/**
 * Obtiene un paciente específico por su ID.
 * La lógica compleja de forceRefresh ya no es necesaria y ha sido eliminada.
 * Siempre traerá datos frescos.
 */
export async function getPacienteById(id: string): Promise<Patient | null> {
    const timestamp = Date.now();
    const url = `${FULL_API_URL}?action=getPacienteById&id=${encodeURIComponent(id)}&_t=${timestamp}`;
    return fetchAPI(url, false); // El segundo parámetro es false por si hay un error, devuelve null.
}

/**
 * Busca pacientes.
 * Siempre traerá datos frescos.
 */
export async function searchPacientes(query: string): Promise<Patient[]> {
    const url = `${FULL_API_URL}?action=searchPacientes&query=${encodeURIComponent(query)}`;
    return fetchAPI(url, true);
}


// --- FUNCIONES OBSOLETAS ---
// Estas funciones ya no son necesarias porque el problema de caché se resuelve en la raíz.

/**
 * @deprecated Esta función ya no es necesaria. El caché se gestiona a nivel de fetch.
 */
export async function forceClearCache(): Promise<{ success: boolean; message: string }> {
    console.warn("Llamada a forceClearCache() obsoleta. El caché del servidor ya está deshabilitado en las peticiones.");
    return { success: true, message: "El caché del servidor está deshabilitado por defecto en las peticiones." };
}

/**
 * @deprecated Es más directo llamar a getPacientesWithAppointments().
 */
export async function getFreshData(): Promise<Patient[]> {
    return getPacientesWithAppointments();
}