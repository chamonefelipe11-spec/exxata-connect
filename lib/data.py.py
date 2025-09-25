import os, csv
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
USERS_CSV = os.path.join(DATA_DIR, "users.csv")
FIELDS = ["email","name","role","password_hash","reset_token","reset_expiry"]

def ensure_store():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(USERS_CSV):
        with open(USERS_CSV, "w", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=FIELDS).writeheader()

def read_users():
    ensure_store()
    with open(USERS_CSV, "r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def write_users(rows):
    ensure_store()
    with open(USERS_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for r in rows: w.writerow(r)

def get_user(email:str):
    email = (email or "").strip().lower()
    for u in read_users():
        if u["email"].lower() == email:
            return u
    return None

def upsert_user(user:dict):
    users = read_users()
    for i,u in enumerate(users):
        if u["email"].lower() == user["email"].lower():
            users[i] = user; break
    else:
        users.append(user)
    write_users(users)

def set_reset_token(email:str, token:str, minutes:int=15):
    u = get_user(email)
    if not u: return False
    u["reset_token"]  = token
    u["reset_expiry"] = (datetime.utcnow()+timedelta(minutes=minutes)).isoformat()
    upsert_user(u)
    return True
