from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from ..extensions import db
from ..models.user import User
from ..utils.responses import ok, err

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not name or not email or not password:
        return err("VALIDATION_ERROR", "name, email, and password are required", 400)

    if len(password) < 6:
        return err("WEAK_PASSWORD", "password must be at least 6 characters", 400)

    existing = User.query.filter_by(email=email).first()
    if existing:
        return err("EMAIL_TAKEN", "an account with this email already exists", 409)

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access = create_access_token(identity=str(user.id))
    refresh = create_refresh_token(identity=str(user.id))

    return ok({"user": user.to_dict(), "access_token": access, "refresh_token": refresh}, status=201)

@auth_bp.post("/login")
def login():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not email or not password:
        return err("VALIDATION_ERROR", "email and password are required", 400)

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return err("INVALID_CREDENTIALS", "email or password is incorrect", 401)

    access = create_access_token(identity=str(user.id))
    refresh = create_refresh_token(identity=str(user.id))

    return ok({"user": user.to_dict(), "access_token": access, "refresh_token": refresh})

@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access = create_access_token(identity=user_id)
    return ok({"access_token": access})

@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return err("NOT_FOUND", "user not found", 404)
    return ok({"user": user.to_dict()})
