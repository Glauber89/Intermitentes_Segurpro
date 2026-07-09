// ============================================
// FIREBASE CONFIGURATION
// ============================================
// INSTRUÇÕES PARA CONFIGURAR:
// 1. Acesse https://console.firebase.google.com
// 2. Clique em "Adicionar projeto" e crie um projeto (ex: "gestao-mineracao")
// 3. No painel do projeto, vá em "Criação" > "Realtime Database"
// 4. Clique em "Criar banco de dados" e escolha o modo de teste
// 5. Vá em Configurações do Projeto (ícone de engrenagem) > Geral
// 6. Em "Seus apps", clique em "</>" (Web) para registrar um app
// 7. Copie as credenciais e cole abaixo
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyAc6GoCwpL8B_IWyl7q4lq0wdisCTU2yxM",
    authDomain: "intermitentes-segurpro.firebaseapp.com",
    databaseURL: "https://intermitentes-segurpro-default-rtdb.firebaseio.com",
    projectId: "intermitentes-segurpro",
    storageBucket: "intermitentes-segurpro.firebasestorage.app",
    messagingSenderId: "1031012559431",
    appId: "1:1031012559431:web:964ba73e8defd18f711f62"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ---- Connection State Monitoring ----
function initConnectionMonitor() {
    const connectedRef = db.ref('.info/connected');
    connectedRef.on('value', (snap) => {
        const isOnline = snap.val() === true;
        document.body.classList.toggle('is-online', isOnline);
        document.body.classList.toggle('is-offline', !isOnline);
        updateConnectionUI(isOnline);
    });
}

function updateConnectionUI(isOnline) {
    const dots = document.querySelectorAll('.status-dot');
    const labels = document.querySelectorAll('.status-label');
    const badge = document.getElementById('connection-badge');

    dots.forEach(dot => {
        dot.classList.toggle('online', isOnline);
        dot.classList.toggle('offline', !isOnline);
    });

    labels.forEach(label => {
        label.textContent = isOnline ? 'Conectado' : 'Sem conexão';
    });

    if (badge) {
        badge.className = `connection-badge ${isOnline ? 'online' : 'offline'}`;
        badge.innerHTML = isOnline
            ? '<span class="badge-dot"></span> Online'
            : '<span class="badge-dot"></span> Offline';
    }
}
