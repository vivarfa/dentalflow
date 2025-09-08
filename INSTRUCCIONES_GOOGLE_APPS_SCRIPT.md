# INSTRUCCIONES PARA ACTUALIZAR GOOGLE APPS SCRIPT

## PASO 1: Acceder a Google Apps Script
1. Ve a https://script.google.com
2. Abre tu proyecto existente con la URL: `AKfycbwrpgTJUvc6Z0nKhHDF5pbqO0pSFoJZUkwpSiAXRgN-1vDS38FmCr2cQU6rj7go5JxSjA`

## PASO 2: Reemplazar el código completo
1. Selecciona TODO el contenido del archivo `codigo.gs` en Google Apps Script
2. Elimínalo completamente
3. Copia y pega el contenido del archivo `codigo.gs` de este proyecto

## PASO 3: Guardar y desplegar
1. Presiona Ctrl+S para guardar
2. Ve a "Implementar" > "Nueva implementación"
3. Selecciona "Aplicación web"
4. Configuración:
   - Ejecutar como: "Yo"
   - Quién tiene acceso: "Cualquier persona"
5. Haz clic en "Implementar"
6. Copia la nueva URL si es diferente

## PASO 4: Verificar funcionamiento
1. Prueba la URL en el navegador agregando `?action=getPacientes`
2. Deberías ver una respuesta JSON con los datos

## CAMBIOS IMPORTANTES REALIZADOS:
- ✅ Función `createJsonResponseWithCORS` actualizada
- ✅ Headers CORS configurados correctamente
- ✅ Compatibilidad mejorada con Vercel

**NOTA IMPORTANTE:** Después de actualizar el código en Google Apps Script, espera unos minutos antes de probar la aplicación en Vercel, ya que los cambios pueden tardar en propagarse.