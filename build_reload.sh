# Builds react app and runs it locally
# assuming Python's virtual environment craated 
# at backend/ folder and named 'venv'

# Chande directory to npm app folder, assuming you're in main dir
cd frontend/
# Build react app
# export PUBLIC_URL=/build
npm run build  && cp ./public/beermug.webp build/static/

# npm run build
cd ..// && source backend/venv/bin/activate && python backend/server_api.py
# cd ..// && source backend/venv/bin/activate && gunicorn -t 600 -w 1 --log-level debug --chdir 'backend/' 'server_api:app'

