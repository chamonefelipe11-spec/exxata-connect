import streamlit as st
from pathlib import Path
from lib.auth import authenticate, register_user, start_reset, finalize_reset

def render_login_card():
    st.markdown('<div class="exx-title">Exxata <span class="accent">Connect</span></div>', unsafe_allow_html=True)
    st.markdown('<div class="exx-subtitle">Acesse sua conta</div>', unsafe_allow_html=True)

    with st.form("login"):
        st.markdown('<div class="exx-card">', unsafe_allow_html=True)
        email = st.text_input("E-mail")
        password = st.text_input("Senha", type="password")
        c1, c2 = st.columns([1,1])
        with c1: submit = st.form_submit_button("Entrar", use_container_width=True)
        with c2: forgot  = st.form_submit_button("Esqueceu a senha?", use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    if submit:
        ok, res = authenticate(email, password)
        if ok:
            st.session_state["auth_user"] = res
            st.success(f"Bem-vindo(a), {res['name']}")
            st.switch_page("pages/01_Home.py")
        else:
            st.error(res)

    if forgot:
        st.session_state["view"] = "reset"
        st.rerun()

    st.markdown('<div class="exx-footer">Não tem uma conta?</div>', unsafe_allow_html=True)
    if st.button("Cadastre-se"):
        st.session_state["view"] = "register"; st.rerun()

def render_register_card():
    st.markdown('<div class="exx-title">Crie sua conta</div>', unsafe_allow_html=True)
    with st.form("register"):
        st.markdown('<div class="exx-card">', unsafe_allow_html=True)
        name = st.text_input("Nome completo")
        email = st.text_input("E-mail")
        p1 = st.text_input("Senha", type="password")
        p2 = st.text_input("Confirmar senha", type="password")
        submit = st.form_submit_button("Criar conta", use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    if submit:
        if p1 != p2:
            st.error("As senhas não conferem.")
        else:
            ok, msg = register_user(email, name, p1)
            if ok:
                st.success(msg); st.session_state["view"] = "login"; st.rerun()
            else:
                st.error(msg)

    if st.button("Voltar ao login"):
        st.session_state["view"] = "login"; st.rerun()

def render_reset_card():
    st.markdown('<div class="exx-title">Redefinir senha</div>', unsafe_allow_html=True)
    tab1, tab2 = st.tabs(["Solicitar código", "Redefinir"])
    with tab1:
        with st.form("reset_request"):
            st.markdown('<div class="exx-card">', unsafe_allow_html=True)
            email = st.text_input("E-mail cadastrado")
            submit = st.form_submit_button("Gerar código", use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)
        if submit:
            ok, token = start_reset(email)
            st.info("Código gerado (em produção, seria enviado por e-mail):")
            st.code(token if ok else "E-mail não encontrado.")

    with tab2:
        with st.form("reset_finalize"):
            st.markdown('<div class="exx-card">', unsafe_allow_html=True)
            email = st.text_input("E-mail")
            token = st.text_input("Código recebido")
            newp = st.text_input("Nova senha", type="password")
            submit2 = st.form_submit_button("Redefinir senha", use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)
        if submit2:
            ok, msg = finalize_reset(email, token, newp)
            (st.success if ok else st.error)(msg)
            if ok: st.session_state["view"] = "login"; st.rerun()

    if st.button("Voltar ao login"):
        st.session_state["view"] = "login"; st.rerun()
