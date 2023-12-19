# Flask React starter

This project integrates a Flask server that serves React app files from the `/build` folder.

## Prerequisites

Before running the app, you need to build the React app. If you're on Linux, you can use the following commands:

```bash
# Navigate to the frontend folder
cd frontend/

# Run the build command
npm run build
```

## Running the App

To run the app:

1. Navigate to the root folder back:

```bash
cd your_project_root/
```

2. Create and activate the Python virtual environment:

```bash
python3 -m venv backend/venv
source backend/venv/bin/activate
```

3. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

4. Run the Flask application:

```bash
python backend/server_api.py
```

## Development

During development, you can use the following command (if you are on Linux) to rebuild your React app and restart the Flask server:

```bash
./build_reload.sh
```

This will automate the process of rebuilding the React app and running the Flask server.


Feel free to copy and use this version as needed. Let me know if you have any further questions or if there's anything else I can assist you with!

