# shared/lib

Esta carpeta guarda wrappers y adaptadores de librerias de terceros.

Reglas:
- Encapsular dependencias externas para no acoplar todo el codigo directamente a la libreria.
- Si cambia la libreria, solo deberia cambiar esta capa.

Ejemplo en este proyecto:
- utils.js (wrapper de clsx + tailwind-merge con cn())
