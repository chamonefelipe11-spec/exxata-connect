import streamlit as st
from lib.guards import require_auth
user = require_auth()
st.title(Dashboard — Exxata)
st.write(fBem-vindo(a), {user['name']}.)
st.page_link(pages02_Projects.py, label=Ir para Projects)
