# # Get the directory of the script
# script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# # Change to the script directory
# cd "$script_dir" || exit 1

# Chande directory to npm app folder
cd frontend/
# Build react app
npm run build 
cp ./favicon.ico build/static/
echo "React app was built successfully"