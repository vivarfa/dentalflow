# DentalFlow 🦷

**Una plataforma de gestión de pacientes y citas, open-source y gratuita, diseñada para consultorios dentales modernos. Creada con Next.js y conectada a Google Sheets.**

---

### ✨ Descripción del Proyecto

**DentalFlow** es una aplicación web intuitiva y potente que simplifica la administración de un consultorio dental. Permite registrar pacientes, agendar citas y llevar un historial clínico detallado, todo desde una interfaz limpia y accesible.

Lo mejor de todo es que utiliza **Google Sheets como base de datos**, lo que la hace increíblemente fácil de configurar y mantener, sin costos de hosting de base de datos. Este repositorio contiene todo el código fuente y las instrucciones para que puedas desplegar tu propia versión de DentalFlow de forma **completamente gratuita**.

### 🚀 Características Principales

*   **Registro de Pacientes en 3 Pasos:**
    1.  **Datos Personales:** Captura la información esencial del paciente.
    2.  **Gestión de Citas:** Agenda la primera cita (fecha, hora, motivo).
    3.  **Historial Clínico (Opcional):** Añade detalles clínicos, tratamientos y control de pagos desde el inicio.
*   **Panel de Gestión de Pacientes:**
    *   Visualiza a todos tus pacientes en una tabla clara, ordenada por la cita más próxima.
    *   Accede al perfil individual de cada paciente con un solo clic.
*   **Dashboard del Paciente:**
    *   Consulta toda la información centralizada: datos personales, citas programadas e historial clínico.
    *   Añade nuevas citas o registros clínicos al historial del paciente en cualquier momento.
*   **Backend sin Servidor:** Toda la lógica de datos es manejada por **Google Apps Script**, que se comunica directamente con tu hoja de cálculo de Google Sheets.

### 🛠️ Stack Tecnológico

*   **Framework Frontend:** [Next.js](https://nextjs.org/)
*   **Librería UI:** [React](https://reactjs.org/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Backend / Base de Datos:** [Google Sheets](https://www.google.com/sheets/about/) + [Google Apps Script](https://developers.google.com/apps-script)
*   **Despliegue Principal:** [GitHub](https://github.com/)
*   **Despliegue:** [Vercel](https://vercel.com/)

---

## ⚙️ Guía de Instalación y Despliegue

Sigue estos pasos para tener tu propia versión de DentalFlow funcionando en minutos.

### **Paso 1: Configurar el Backend (Google Sheets y Apps Script)**

Esta es la parte más importante. Aquí crearemos nuestra "base de datos".

1.  **Crea una copia de la Hoja de Cálculo:**
    *   Haz clic en este enlace para crear una copia de la plantilla de Google Sheets en tu propia cuenta de Google:
        **[Plantilla de Google Sheets para DentalFlow](https://docs.google.com/spreadsheets/d/1pxNI3c3bJX7PALvEI7Ul8jxt8QnBxgIn1IPI3q84N-4/edit?usp=sharing)**.
    *   Asegúrate de que tu hoja de cálculo tenga tres pestañas en la parte inferior con los nombres exactos: `Pacientes`, `Citas` e `Historial_Clínico`.

2.  **Configura el Código de Apps Script:**
    *   Dentro de tu nueva hoja de cálculo, ve al menú `Extensiones` > `Apps Script`.
    *   Se abrirá un editor de código. Borra todo el código que aparece por defecto.
    *   Copia todo el contenido del archivo `codigo.gs` de este repositorio de GitHub y pégalo en el editor de Apps Script.
    *   Guarda el proyecto (ícono de disquete).

3.  **Despliega el Script como una Aplicación Web:**
    *   En la parte superior derecha del editor de Apps Script, haz clic en el botón azul **`Implementar`** y selecciona **`Nueva implementación`**.
    *   Haz clic en el ícono de engranaje (`Seleccionar tipo`) y elige **`Aplicación web`**.
    *   En la configuración, asegúrate de que quede así:
        *   **Ejecutar como:** `Yo (tu correo electrónico)`
        *   **Quién tiene acceso:** `Cualquier usuario`
    *   Haz clic en **`Implementar`**.
    *   Google te pedirá que autorices los permisos del script. Acepta todos los permisos.
    *   **¡IMPORTANTE!** Al finalizar, se te proporcionará una **URL de la aplicación web**. Cópiala y guárdala. La necesitarás en el siguiente paso.

### **Paso 2: Configurar el Proyecto Frontend (Next.js)**

1.  **Clona el Repositorio:**
    *   Abre una terminal en tu computadora y ejecuta el siguiente comando:
      ```bash
      git clone https://github.com/tu-usuario/dentalflow.git
      cd dentalflow
      ```

2.  **Instala las Dependencias:**
    ```bash
    npm install
    ```

3.  **Actualiza tu Proyecto en GitHub:**
    *   Después de hacer cambios, usa estos comandos para subir tus actualizaciones a tu repositorio.

    *   **Paso A: Prepara los archivos**
        ```bash
        # El punto (.) agrega todos los archivos modificados
        git add .
        ```

    *   **Paso B: Guarda los cambios con un mensaje**
        ```bash
        # El mensaje describe el cambio que hiciste
        git commit -m "Actualizo el archivo README"
        ```

    *   **Paso C: Sube los cambios a GitHub**
        ```bash
        # Esto envía tus cambios a la nube
        git push
        ```

### **Paso 3: Desplegar en Vercel**

1.  **Sube tu proyecto a GitHub:**
    *   Crea un nuevo repositorio en tu cuenta de GitHub y sube el código que clonaste.

2.  **Importa el Proyecto en Vercel:**
    *   Regístrate o inicia sesión en [Vercel](https://vercel.com/) con tu cuenta de GitHub.
    *   Haz clic en `Add New...` > `Project`.
    *   Importa el repositorio de DentalFlow desde tu GitHub.

3.  **Configura las Variables de Entorno en Vercel:**
    *   Durante la configuración del proyecto, busca la sección `Environment Variables`.
    *   Añade una nueva variable:
        *   **Name:** `NEXT_PUBLIC_API_URL`
        *   **Value:** Pega la misma URL de tu aplicación web de Apps Script que guardaste anteriormente.
    *   Haz clic en `Add`.

4.  **Despliega:**
    *   Haz clic en el botón **`Deploy`**. Vercel construirá y desplegará tu aplicación automáticamente. ¡Y listo! Tu plataforma DentalFlow estará en línea.

---

### 👨‍💻 Acerca del Desarrollo

Este proyecto fue desarrollado por **[BillCodex](https://www.billcodex.com)** como una solución de código abierto para la comunidad de profesionales de la salud.

### 💬 Comentarios y Futuros Proyectos

¿Te ha sido útil esta plataforma? ¿Tienes alguna sugerencia? ¡Házmelo saber!

Déjame un comentario o abre un *issue* en GitHub. ¿Qué otro tipo de proyecto te gustaría que construyéramos y compartiéramos con la comunidad?

---

### 📄 Licencia

Este proyecto se distribuye bajo la licencia Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.
*Puedes ver el texto completo de la licencia aquí: (https://creativecommons.org/licenses/by-nc-sa/4.0/)*

Esto significa que eres libre de:

Compartir — copiar y redistribuir el material en cualquier medio o formato.
Adaptar — remezclar, transformar y construir sobre el material.

Bajo las siguientes condiciones:

Atribución — Debes dar el crédito apropiado, proporcionar un enlace a la licencia e indicar si se realizaron cambios.
No Comercial — No puedes utilizar el material para fines comerciales.
Compartir Igual — Si remezclas, transformas o creas a partir del material, debes distribuir tus contribuciones bajo la misma licencia que el original.

En resumen: puedes usar y modificar este proyecto para fines personales o educativos, pero no para crear un producto comercial o venderlo.
