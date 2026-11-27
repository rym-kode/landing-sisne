# Landing SISNE

SISNE — Sistemas para negocios. Developed by: Rym Tech.

Abrí `index.html` en el navegador. No necesita instalar nada.

## Datos de contacto (un solo lugar)
Al principio de `js/main.js`, objeto `SISNE_CONFIG`:
- `whatsapp`: número de WhatsApp Business, solo dígitos (ej. `5491123456789`). Se usa en todos los botones de WhatsApp, el botón flotante y la barra del celular.
- `whatsappLabel`: cómo se muestra el número.
- `whatsappMessage`: mensaje que aparece escrito al abrir el chat.
- `email`: email corporativo.
- `web3formsKey`: clave gratuita de https://web3forms.com. Con la clave, el formulario envía la consulta a tu email. Sin clave, abre WhatsApp con la consulta escrita.

## Qué completar
- **Plantillas**: mientras `<body>` tenga el atributo `data-template` ves etiquetas "Plantilla" sobre lo que falta (casos, testimonio y equipo). Al terminar, borrá ese atributo en `index.html`.
- **Casos** (`#proyectos`): rubro, nombre, descripción, resultado y una captura del sistema en `.proj__media`.
- **Equipo** (`#equipo`): fotos, nombres y una línea de experiencia por persona. Revisá el texto de Rym Tech.
- **Tablero del hero**: los números son ilustrativos y lo aclaran.
- **Dominio**: cuando lo tengas, completá `canonical` y la URL absoluta de `og:image` en `index.html`, y el `Sitemap` en `robots.txt`.
- **Analítica**: pegá el snippet de GA4 o Plausible en el `<head>`. Ya se envían los eventos `generate_lead` y `contact_whatsapp`.

## Logo (carpeta `assets/`)
- `sisne-logo.png` / `sisne-logo-light.png`: isotipo + "sisne", para header (fondo claro) y footer (fondo oscuro).
- `sisne-logo-full.png` / `sisne-logo-full-light.png`: logo completo con "Sistemas para negocios".
- `sisne-mark.png` / `sisne-mark-light.png`: solo el cisne.
- `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`, `og-image.png` (imagen al compartir el link).
- `logo-mark.svg` y `favicon.svg` son del logo anterior y ya no se usan.

## Colores (css/styles.css, bloque `:root`), tomados del logo
Azul marino `#01193a` (variable `--negro`), azul SISNE `#0284e1`, azul claro `#4fb0f2`, azul para texto `#0270c0`, gris azulado `#4a5f78`, hielo `#eef5fc`, blanco.

## Tipografías
Familjen Grotesk (títulos) e Instrument Sans (texto), desde Google Fonts.
