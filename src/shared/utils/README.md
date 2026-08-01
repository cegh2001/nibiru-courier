# shared/utils

Esta carpeta guarda funciones puras.

Reglas:
- Deben recibir datos y devolver datos.
- No deben hacer fetch, axios, localStorage, sessionStorage, BroadcastChannel ni acceso directo a APIs del navegador con efectos secundarios.
- Deben ser reutilizables en otros proyectos con cambios minimos.

Ejemplos en este proyecto:
- helpers.js
- parsers/paymentParsers.js
- parsers/paymentReceiptParser.js
- safe.js
