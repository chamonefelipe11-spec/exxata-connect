import bcrypt
from datetime import datetime
from .data import get_user, upsert_user, set_reset_token

def hash_password(p:str)->str:
    return bcrypt.hashpw(p.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(p:str, h:str)->bool:
    try: return bcrypt.checkpw(p.encode("utf-8"), h.encode("utf-8"))
    except: return False

def register_user(email:str, name:str, password:str, role:str="user"):
    email = (email or "").strip().lower()
    if get_user(email): return False, "Já existe uma conta com esse e-mail."
    if len(password) < 6: return False, "A senha deve ter pelo menos 6 caracteres."
    upsert_user({
        "email": email, "name": name.strip(), "role": role,
        "password_hash": hash_password(password),
        "reset_token": "", "reset_expiry": ""
    })
    return True, "Conta criada com sucesso."

def authenticate(email:str, password:str):
    u = get_user((email or "").strip().lower())
    if not u: return False, "E-mail não encontrado."
    if not verify_password(password, u.get("password_hash","")):
        return False, "Senha inválida."
    return True, u

def start_reset(email:str):
    import secrets
    u = get_user((email or "").strip().lower())
    if not u: return False, "E-mail não encontrado."
    token = secrets.token_urlsafe(8)
    set_reset_token(u["email"], token)
    return True, token  # Em produção: enviar por e-mail

def finalize_reset(email:str, token:str, new_password:str):
    from .data import get_user, upsert_user
    u = get_user((email or "").strip().lower())
    if not u: return False, "E-mail não encontrado."
    if token != u.get("reset_token",""): return False, "Código inválido."
    exp = u.get("reset_expiry","")
    if exp:
        try:
            if datetime.utcnow() > datetime.fromisoformat(exp):
                return False, "O código expirou."
        except: pass
    if len(new_password) < 6: return False, "A nova senha deve ter pelo menos 6 caracteres."
    u["password_hash"] = hash_password(new_password)
    u["reset_token"] = ""; u["reset_expiry"] = ""
    upsert_user(u)
    return True, "Senha redefinida com sucesso."
