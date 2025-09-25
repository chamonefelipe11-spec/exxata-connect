import streamlit as st

def require_auth():
    user = st.session_state.get("auth_user")
    if not user:
        st.switch_page("app.py")  # volta ao login
    return user
