# Mobihub — versión standalone (Firebase)

Esta es la versión de Mobihub pensada para vivir en tu propio hosting (GitHub
Pages, Vercel, Netlify, etc.) con dominio propio, en lugar de depender del
link de Claude. Tiene la misma funcionalidad que la versión que venías
usando: dashboard, inventario multi-depósito, reservas, fichas de producto
en PDF, remitos en PDF y exportación de inventario a Excel.

La diferencia técnica es el guardado de datos: la versión anterior corría
adentro de Claude y usaba un almacenamiento propio de esa plataforma (solo
funciona ahí). Esta versión usa **Firebase Firestore**, una base de datos
real de Google, gratuita para este volumen de uso, que anda en cualquier
hosting de archivos estáticos.

Tus datos reales (los 8 productos, el depósito, el stock y las 5 reservas
cargadas hasta el 14/09) ya están incluidos en `seed-data.js` y se cargan
solos la primera vez que la app se conecta a tu Firebase vacío. Las 2 fotos
de la carpa 6x6 no se migraron automáticamente (ver más abajo por qué) —
hay que volver a subirlas una vez.

## Qué archivos hay acá

- `index.html` — la app completa (HTML + CSS + JS en un solo archivo).
- `firebase-config.js` — acá pegás las credenciales de tu proyecto Firebase.
- `seed-data.js` — tu catálogo y reservas reales, para la carga inicial.
- `README.md` — este archivo.

Los tres archivos (`index.html`, `firebase-config.js`, `seed-data.js`) tienen
que estar en la misma carpeta, siempre.

## Paso 1 — Crear el proyecto Firebase (gratis, 5 minutos)

1. Andá a [console.firebase.google.com](https://console.firebase.google.com)
   con tu cuenta de Google y hacé clic en **"Agregar proyecto"**.
2. Ponele un nombre (por ejemplo `mobihub`) y seguí los pasos. No hace falta
   activar Google Analytics — podés dejarlo desactivado.
3. Una vez creado el proyecto, en el menú lateral izquierdo andá a
   **Compilación → Firestore Database** y hacé clic en **"Crear base de
   datos"**.
   - Elegí una ubicación cercana (por ejemplo `southamerica-east1`, San
     Pablo — es la más cercana a Argentina).
   - Cuando te pregunte por las reglas de seguridad, elegí **"Modo de
     prueba"** por ahora (las vamos a reemplazar en el Paso 3).
4. Volvé a la pantalla principal del proyecto (ícono de casita) y hacé clic
   en el ícono **`</>`** ("Agregar app" → Web) para registrar una app web.
   - Ponele un nombre (por ejemplo "Mobihub web"). No hace falta activar
     Firebase Hosting acá.
   - Firebase te va a mostrar un bloque de código con un objeto
     `firebaseConfig = { apiKey: "...", authDomain: "...", ... }`.

## Paso 2 — Pegar la configuración

Abrí `firebase-config.js` en este proyecto y reemplazá los valores
`"PEGAR_ACA"` por los que te mostró Firebase en el paso anterior. Quedaría
algo así (con tus valores reales, no estos):

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyD...",
  authDomain: "mobihub-xxxxx.firebaseapp.com",
  projectId: "mobihub-xxxxx",
  storageBucket: "mobihub-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

Estos valores **no son secretos** — en cualquier app web (esta incluida)
terminan visibles en el navegador de quien la usa, así que no pasa nada si
alguien los ve. Lo que protege tus datos son las reglas de Firestore, no
este archivo.

## Paso 3 — Reglas de seguridad de Firestore

Esta app, igual que la versión anterior, no tiene login: cualquiera con el
link puede ver y editar los datos (solo pide "poné tu nombre" para saber
quién hizo cada cambio, no valida identidad). Es la misma exposición que ya
tenía el link de Claude — no es un paso atrás — pero ahora es tu propia base
de datos, así que conviene dejarlo explícito y a propósito en vez de en
"modo de prueba" (que además expira solo a los 30 días y deja de andar).

En la consola de Firebase, andá a **Firestore Database → Reglas** y pegá
esto, reemplazando lo que haya:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Hacé clic en **"Publicar"**. Si en algún momento querés agregar un login
(para que no cualquiera pueda editar), avisame y lo armamos — es un cambio
más grande porque hoy la app no tiene ningún concepto de usuarios.

## Paso 4 — Probar que ande

Con los 3 archivos en una misma carpeta, la forma más simple de probarlo
localmente es abrir una terminal ahí y correr (necesitás Python instalado,
que ya viene en Mac y Linux):

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000/index.html` en el navegador. **No funciona**
si simplemente hacés doble clic en `index.html` (el navegador bloquea la
carga de `seed-data.js` por seguridad al abrir un archivo local así) — tiene
que servirse por http, ya sea con este servidor local o ya subido a
internet.

La primera vez que abra correctamente contra tu Firebase, va a cargar
automáticamente tu catálogo real (8 productos, 1 depósito, 5 reservas). Los
próximos arranques no vuelven a sembrar nada — quedan los datos como los
dejaste.

### Fotos de productos

Las 2 fotos que ya tenías cargadas para la Carpa 6x6 no viajaron
automáticamente en esta migración (son archivos pesados y no valía la pena
inflar el proyecto con eso). Una vez que la app esté conectada a tu
Firebase, entrá a la ficha de la Carpa 6x6 y volvé a subirlas — 30 segundos.

## Paso 5 — Subirlo a algún lado con dominio propio

Con los 3 archivos podés subir esto a cualquier hosting de archivos
estáticos. Las opciones más simples y gratuitas:

- **GitHub Pages**: subís estos 3 archivos a un repositorio de GitHub,
  activás "Pages" en la configuración del repo, y te da una URL
  `tuusuario.github.io/nombre-repo`. Después podés apuntarle un dominio
  propio desde la configuración de Pages.
- **Vercel** o **Netlify**: arrastrás la carpeta con los 3 archivos a su
  panel (o conectás el repo de GitHub) y te dan una URL al instante, con
  posibilidad de dominio propio también.

Dijiste que todavía no decidiste dónde lo vas a alojar — cualquiera de estas
opciones funciona igual de bien con este proyecto tal cual está, así que
podés decidirlo cuando quieras sin tener que volver a tocar el código.

## Preguntas frecuentes

**¿Esto tiene costo?** Firebase tiene un plan gratuito (Spark) que alcanza
de sobra para este uso (unas pocas reservas y productos por día). Si en
algún momento crece mucho el volumen, Firebase avisa antes de cobrar nada.

**¿Puedo seguir usando el link de Claude en paralelo?** Sí, pero son bases
de datos separadas — lo que cargues en uno no aparece en el otro a partir de
ahora. Conviene elegir uno solo como "el real" para evitar confusiones.

**¿Y si quiero agregar un login más adelante?** Se puede — Firebase incluye
Authentication. Es un cambio de alcance mayor (hay que decidir quién puede
ver/editar qué), así que mejor charlarlo aparte cuando haga falta.
