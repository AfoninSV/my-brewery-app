from flask import Flask, request, render_template
from flask_bcrypt import Bcrypt

from werkzeug.middleware.proxy_fix import ProxyFix

from secrets import token_hex
import logging
import json
import sched
import time
from datetime import datetime

from database import remove_kegshoe, remove_ekos, schedule_deliveries_table_removal
import invoices_getter
import settings
import database as db
import auth
import threading

logging.basicConfig(filename="serverlog.log", filemode="w", level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
schedule_deliveries_table_removal()

DEBUG = False
HOST = "0.0.0.0"
PORT = 8000



app = Flask(__name__, 
            template_folder=settings.TEMPLATE_DIR.absolute(), 
            static_folder=settings.STATIC_DIR.absolute())

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)


app.config.update(SECRET_KEY=token_hex(16))

app.register_blueprint(auth.bp)
bcrypt = Bcrypt(app)

def schedule_collecting_invoices_at_night():
    scheduler = sched.scheduler(time.time, time.sleep)
    now = datetime.now()
    morning = datetime(year=now.year, month=now.month, day=now.day+1, hour=5)

    scheduler.enterabs(datetime.timestamp(morning), 2, invoices_getter.get_deliveries_total)
    threading.Thread(target=scheduler.run).start()
    logging.info(f"Task to collect deliveries was cheduled at {morning}")
schedule_collecting_invoices_at_night()

# Returning HTML urls:

@app.route("/", methods=["GET"])
def home_page():
    return render_template("index.html")


@app.route("/scanner", methods=["POST", "GET"])
def scan_page():
    return render_template("index.html")


@app.route("/mbw", methods=["GET"])
def mbw_page():
    return render_template("index.html")

@app.route("/gravity", methods=["GET"])
def gravity_page():
    return render_template("index.html")

@app.route("/invoices/today", methods=["GET"])
def invoices_page_today():
    return render_template("index.html")

@app.route("/invoices/tomorrow", methods=["GET"])
def invoices_page_tomorrow():
    return render_template("index.html")


# Calculating (functional) urls:

@app.route("/get_ekos_total")
def e_total():
    logging.info("/get_ekos_total")
    data = invoices_getter.collect_ekos_total_standalone()
    threading.Thread(target=remove_ekos).start()
    logging.info("return ekos total")
    return data


@app.route("/get_ks_total")
def ks_total():
    logging.info("/get_ks_total")
    data = invoices_getter.collect_kegshoe_total()
    threading.Thread(target=remove_kegshoe).start()
    logging.info("return ks total")
    return data


@app.route("/get_invoices/<string:day_value>", methods=["GET"])
def find_invoices(day_value: str):
    logging.info(f"/get_invoices/{day_value}")
    ### testing line
    #data: dict = invoices_getter.get_invoices_total(day_value)
    try:
        data: dict = invoices_getter.get_invoices_total(day_value)
    except Exception as e:
        logging.error("Flask - /get_invoices: return invoices 500:", e)
        return "", 500
    logging.info("return invoices")
    return data


@app.route("/cycles", methods=["POST"])
def add_cycle():
    entries: str = json.dumps(request.json.get("entries"))
    user_email: str = request.json.get("userEmail")
    
    if (not user_email) or (not entries):
        return "", 422

    try:
        with db.session as ss:
            if not (user := db.if_email_exists(user_email)):
                return "", 204

            cycle = db.Cycle(entries=entries, user=user)
            ss.add(cycle)
            ss.commit()
    except Exception as error:
        return "Database error", 500
    
    return "", 201


@app.route("/cycles", methods=["GET"])
def get_cycles():
    with db.session as ss:
        cycles = ss.query(db.Cycle).order_by(db.Cycle.id.desc()).all()
        data: list[dict] = [{"entries": c.entries, 
                             "name": c.user.name, 
                             "datetime": c.datetime} 
                            for c in cycles]
    return data, 200


@app.route("/cycle/<string:keg_id>")
def get_cycles_containing(keg_id):
    with db.session as ss:
        cycles = ss.query(db.Cycle).filter(db.Cycle.entries.contains(keg_id)).order_by(db.Cycle.id.desc()).all()
        data: list[dict] = [{"entries": c.entries, 
                             "name": c.user.name, 
                             "datetime": c.datetime} 
                            for c in cycles]
        return data, 200

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEBUG)