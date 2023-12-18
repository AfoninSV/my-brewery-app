# Chande directory to npm app folder
cd frontend/
# Build react app
npm run build 
cp ./favicon.ico build/static/
echo "React app was built successfully"

cd ..//
source backend/venv/bin/activate
python3 backend/server_api.py