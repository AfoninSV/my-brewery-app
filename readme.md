# My brewery app

The app helps you automate your brewery routines such as:
- Checking if a city is located within the HRM area to determine if an order is for local delivery.
- Scanning your beer box barcode and double-checking its printed correctness.
- Converting beer Plato into Specific Gravity and viewing the minimum beer amount in each can type.
- Collecting Kegshoe and Ekos kegs quantity totals for comparison with kegs quantity to be delivered, ensuring you always know if you run out of any brand.
- Providing a useful and easy-to-watch data table.

---
This project integrates a Flask server that serves React app files from the `/build` folder.

## Prerequisites

Before running the app, you need to build the React app. If you're on Linux, you can use the following commands:

```bash
# Navigate to the frontend folder
cd frontend/

# Run the build command
npm run build
```
Additionally, you need to [download](https://googlechromelabs.github.io/chrome-for-testing/) both Chrome and Chromedriver. Place Chrome in the chrome-linux64 folder and Chromedriver in the backend/ directory:

```bash
backend/
├── chrome-linux64/
└── chromedriver
```

### Running the App
To run the app:

Navigate to the root folder back:
```bash
cd your_project_root/
```
Create and activate the Python virtual environment:
```bash
python3 -m venv backend/venv
source backend/venv/bin/activate
```
Install backend dependencies:
```bash
pip install -r backend/requirements.txt
```
Run the Flask application:
```bash
python backend/server_api.py
```
### Development
During development, you can use the following command (if you are on Linux) to rebuild your React app and restart the Flask server:

```bash
./build_reload.sh
```
This will automate the process of rebuilding the React app and running the Flask server.

Feel free to copy and use this version as needed.