#!/bin/sh

# Set defaults if not provided
: "${VITE_API_BASE_URL:=http://localhost:4001}"

# Generate config.js
cat <<EOF > /usr/share/nginx/html/config.js
window.CONFIG = {
  VITE_API_BASE_URL: "$VITE_API_BASE_URL"
};
EOF

echo "Generated config.js with VITE_API_BASE_URL=$VITE_API_BASE_URL"

# Execute CMD
exec "$@"
