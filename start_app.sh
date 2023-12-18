# The script is starting backend with its virtual environment
# and then starts react server as well 

# Get the directory of the script
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the script directory
cd "$script_dir" || exit 1

# Check if the virtual environment exists
if [ -f "backend/venv/bin/activate" ]; then
    # Activate the virtual environment
    source backend/venv/bin/activate
else
    echo "Virtual environment not found. Please create and activate it."
    exit 1
fi

# Start the Flask server
python3 backend/server_api.py &> /dev/null &
flask_pid=$(pgrep -f "python3 backend/server_api.py")
echo "Flask server started successfully"

# Start React server
cd frontend/ && npm start &> /dev/null &
react_pid=$(pgrep -f "npm start")
echo "React server started successfully"

echo "Flask PID: $flask_pid"
echo "React PID: $react_pid"