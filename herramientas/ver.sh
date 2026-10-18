#!/bin/sh
# Copia el sitio a la carpeta que el previsualizador sí puede leer.
# El sandbox del preview no tiene acceso a ~/Downloads, así que se sirve
# desde el scratchpad de la sesión. La fuente de verdad sigue siendo esta carpeta.
DESTINO="/private/tmp/claude-501/-Users-gabsta-Downloads/642f1922-adcc-4f10-8e21-1642f0012bae/scratchpad/sitio"
rm -rf "$DESTINO"
cp -R "$(dirname "$0")" "$DESTINO"
echo "sincronizado → $DESTINO"
