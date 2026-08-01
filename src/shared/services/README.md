# shared/services

Esta carpeta guarda logica con efectos secundarios y codigo acoplado a la app.

Reglas:
- Aqui vive la comunicacion con backend y APIs externas.
- Aqui vive la integracion con browser APIs con side effects.
- Puede contener logica de negocio aplicada al dominio.

Ejemplos en este proyecto:
- apiClient.js
- documentTextExtractor.js
- fetcher.js
- fullFetcher.js
- ocrService.js
- mediaCompressor.js
- navigationConfig.js
- roleAccess.js
- channels/authChannel.js
- channels/syncChannel.js
- apis/*.js
