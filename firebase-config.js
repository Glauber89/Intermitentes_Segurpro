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
    apiKey: "COLE_SUA_API_KEY_AQUI",
    authDomain: "COLE_SEU_AUTH_DOMAIN_AQUI",
    databaseURL: "COLE_SUA_DATABASE_URL_AQUI",
    projectId: "COLE_SEU_PROJECT_ID_AQUI",
    storageBucket: "COLE_SEU_STORAGE_BUCKET_AQUI",
    messagingSenderId: "COLE_SEU_SENDER_ID_AQUI",
    appId: "COLE_SEU_APP_ID_AQUI"
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
