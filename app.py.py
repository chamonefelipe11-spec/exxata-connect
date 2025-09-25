import streamlit as st
from pathlib import Path
from lib.data import ensure_store
from ui.login import render_login_card, render_register_card, render_reset_card

st.set_page_config(page_title="Exxata Connect", page_icon="🔐", layout="centered")

# CSS + BG
css = (Path(__file__).parent / "assets" / "theme.css").read_text(encoding="utf-8")
st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)
st.markdown('<div style="background:#F1F5F9; position:fixed; inset:0; z-index:-1;"></div>', unsafe_allow_html=True)

ensure_store()
if "view" not in st.session_state:
    st.session_state["view"] = "login"

# se já está logado, vai pra Home
if st.session_state.get("auth_user"):
    st.switch_page("pages/01_Home.py")

# GATE: telas de login/cadastro/reset
view = st.session_state["view"]
if view == "login":
    render_login_card()
elif view == "register":
    render_register_card()
else: # reset
    render_reset_card()
