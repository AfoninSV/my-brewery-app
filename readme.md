# Project Name

This project integrates a Flask server that serves React app files.

## Prerequisites

Before running the app, you need to build the React app. If you're on Linux, you can use the following commands:

cd frontend/
npm run build

## Running the App

To run the app:

1. Navigate to the root folder:

cd your_project_root/

2. Activate the Python virtual environment:

source backend/venv/bin/activate

3. Run the Flask application:

python backend/server_api.py

## Development

During development, you can use the following command (if you are on Linux) to rebuild your React app and restart the Flask server:

./build_reload.sh

This will automate the process of rebuilding the React app and running the Flask server.
