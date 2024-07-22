# Navega al directorio 'client'
cd client
npm install
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm run build

# Vuelve al directorio raíz
cd ..

# Navega al directorio 'server'
cd server
npm install
