#!/bin/bash
echo '
echo
hugo version

echo
echo -en "\033[1;32mStart local server using:\033[0m "
if [ "$CODESPACES" = "true" ]; then
    echo "hugo server --baseURL https://$CODESPACE_NAME-1313.app.github.dev --appendPort=false"
else
    echo "hugo server"
fi
echo
' >> ~/.bashrc
