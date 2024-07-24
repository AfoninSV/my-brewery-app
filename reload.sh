lsof -i :8000 | grep "gunicorn" | head -n 1 | cut -d ' ' -f 2 | xargs kill -9 &> /dev/null
lsof -i :8000 | grep "gunicorn" | head -n 1 | cut -d ' ' -f 2 | xargs kill -9 &> /dev/null
sleep 5
source backend/venv/bin/activate
sleep 1
gunicorn -t 600 -w 4 --chdir backend/ --log-level info server_api:app &>> gunicorn.log &
sudo systemctl restart nginx
lsof -i :8000