import streamlit as st
from supabase import create_client, Client

# Conectar ao Supabase
url = "https://ndnuhrpghiijqsjzfzto.supabase.co"  # Seu URL Supabase
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbnVocnBnaGlpanFzanpmenRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjQ1NTAsImV4cCI6MjA3NDQwMDU1MH0.vIK3MZNMW9vwS-4u4ZDON1cJduwpjKQqhIk-tl5lB4I"  # Sua chave anon
supabase: Client = create_client(url, key)

# Função de autenticação
def check_authentication():
    session = supabase.auth.session()
    if not session:
        st.warning("Por favor, faça login.")
        return False
    return True

# Página de login (simples)
def login_page():
    st.title("Login Exxata Connect")
    email = st.text_input("E-mail")
    password = st.text_input("Senha", type="password")
    if st.button("Entrar"):
        response = supabase.auth.sign_in(email=email, password=password)
        if response.error:
            st.error("Erro de autenticação!")
        else:
            st.success("Login bem-sucedido!")

# Página de dashboard
def dashboard_page():
    if not check_authentication():
        return

    st.title("Dashboard Exxata Connect")
    st.write("Bem-vindo ao painel de controle! Aqui estão os seus projetos.")
    
    # Exemplo de busca de projetos
    data = supabase.table("projects").select("*").execute()
    if data.data:
        st.write(data.data)
    else:
        st.write("Não há projetos disponíveis.")

# Função para navegação entre páginas
def main():
    st.set_page_config(page_title="Exxata Connect")
    page = st.sidebar.selectbox("Escolha uma página", ["Login", "Dashboard"])

    if page == "Login":
        login_page()
    elif page == "Dashboard":
        dashboard_page()

# Rodar o app
if __name__ == "__main__":
    main()
