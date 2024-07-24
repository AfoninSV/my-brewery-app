from flask import request, Blueprint

import database as db

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route("/check_email", methods=["POST"])
def check_username():
    email = request.json.get("email")
    if db.if_email_exists(email):
        return "", 204
    return "", 200


@bp.route("/register", methods=["POST"])
def register():
    from server_api import bcrypt
    
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if name and email and password:
        hashed_password = bcrypt.generate_password_hash(password)

        if db.if_email_exists(email):
            return "", 204
    
        with db.session as ss:
            user = db.User(name=name, email=email, password=hashed_password)
            ss.add(user)
            ss.commit()
    
        return "", 201
    
    return "", 204

@bp.route("/login", methods=["POST"])
def login():
    from server_api import bcrypt

    user_data: dict = request.json
    email = user_data.get("email")
    password = user_data.get("password")

    if email and password:
        if user := db.if_email_exists(email):
            if bcrypt.check_password_hash(user.password, password):
                return {"user": {"name": user.name, 
                                 "email": user.email,
                                 "cameraId": user.cameraId or "undefined"}}, 200
            else:
                return "", 401
        return "", 403
    print("/login: no email or passworg received")
    return "", 400

@bp.route("/setcameraid", methods=["POST"])
def set_user_camera() -> bool:
    email = request.json.get("email")
    cameraId = request.json.get("cameraId")
    if (cameraId and email):
        with db.session as ss:
            user = ss.query(db.User).where(db.User.email == email).first()
            user.cameraId = cameraId
            ss.commit()
        return "", 200
    else:
        return "", 204
