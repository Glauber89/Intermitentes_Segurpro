// ============================================
// DATABASE.JS - Custom REST API with Netlify Proxy
// ============================================

// Detecta se está rodando localmente ou no Netlify
const API_BASE = 'https://intermitentes-segurpro-default-rtdb.firebaseio.com';

const Database = {
    colaboradoresListeners: [],
    coberturasListeners: [],
    atividadesListeners: [],
    pollInterval: null,
    isOnline: true,

    // Função central para requisições
    async request(path, options = {}) {
        try {
            const res = await fetch(`${API_BASE}/${path}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            
            // Retorna JSON (ou null se estiver vazio)
            const text = await res.text();
            const data = text ? JSON.parse(text) : null;

            // Se a requisição funcionou, estamos online
            if (!this.isOnline) {
                this.isOnline = true;
                this.updateConnectionUI(true);
            }
            return data;
        } catch (error) {
            console.error(`Erro na requisição para ${path}:`, error);
            // Se falhou por rede, estamos offline
            if (this.isOnline) {
                this.isOnline = false;
                this.updateConnectionUI(false);
            }
            throw error;
        }
    },

    // Interface visual de conexão (substitui o antigo firebase-config)
    updateConnectionUI(isOnline) {
        document.body.classList.toggle('is-online', isOnline);
        document.body.classList.toggle('is-offline', !isOnline);
        
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
    },

    // =====================
    // COLABORADORES
    // =====================

    async addColaborador(data) {
        const payload = {
            ...data,
            status: data.status || 'aguardando_convocacao',
            statusInfo: data.statusInfo || {},
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // POST no Firebase cria um ID único e retorna { name: "-Ox..." }
        const res = await this.request('colaboradores.json', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const id = res.name;
        
        // Atualiza o objeto para conter o próprio ID
        await this.request(`colaboradores/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify({ id })
        });
        
        payload.id = id;
        
        await this.logActivity('cadastro', `${data.nome} cadastrado como ${data.funcao}`);
        this.poll(); // Atualiza a tela imediatamente
        return payload;
    },

    async updateColaborador(id, data) {
        await this.request(`colaboradores/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                ...data,
                updatedAt: Date.now()
            })
        });
        await this.logActivity('edicao', `${data.nome || 'Colaborador'} atualizado`);
        this.poll();
    },

    async deleteColaborador(id, nome) {
        await this.request(`colaboradores/${id}.json`, {
            method: 'DELETE'
        });
        await this.logActivity('exclusao', `${nome || 'Colaborador'} removido do sistema`);
        this.poll();
    },

    async updateStatus(id, status, statusInfo = {}, nome = '') {
        await this.request(`colaboradores/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                status,
                statusInfo,
                updatedAt: Date.now()
            })
        });

        const statusLabels = {
            trabalhando: 'Trabalhando',
            cobertura: 'Em Cobertura',
            aguardando_convocacao: 'Aguardando Convocação',
            ferias: 'Férias',
            afastado: 'Afastado',
            folga: 'Folga'
        };
        await this.logActivity('status', `${nome} → ${statusLabels[status] || status}`);
        this.poll();
    },

    onColaboradoresChanged(callback) {
        this.colaboradoresListeners.push(callback);
    },

    async getColaboradorById(id) {
        const data = await this.request(`colaboradores/${id}.json`);
        return data ? { id, ...data } : null;
    },

    // =====================
    // COBERTURAS
    // =====================

    async addCobertura(data) {
        const payload = {
            ...data,
            ativa: true,
            createdAt: Date.now()
        };

        const res = await this.request('coberturas.json', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const id = res.name;
        
        await this.request(`coberturas/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify({ id })
        });
        
        payload.id = id;
        await this.logActivity('cobertura', `${data.colaboradorNome} cobrindo ${data.substituindoNome} em ${data.mina}`);
        this.poll();
        return payload;
    },

    async finalizarCobertura(id) {
        await this.request(`coberturas/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                ativa: false,
                finalizadoEm: Date.now()
            })
        });
        this.poll();
    },

    async deleteCobertura(id) {
        await this.request(`coberturas/${id}.json`, {
            method: 'DELETE'
        });
        this.poll();
    },

    onCoberturasChanged(callback) {
        this.coberturasListeners.push(callback);
    },

    // =====================
    // ACTIVITY LOG
    // =====================

    async logActivity(action, details) {
        const payload = {
            action,
            details,
            timestamp: Date.now()
        };
        await this.request('atividades.json', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        this.poll();
    },

    async deleteActivity(id) {
        await this.request(`atividades/${id}.json`, {
            method: 'DELETE'
        });
        this.poll();
    },

    onActivitiesChanged(callback, limit = 30) {
        this.atividadesListeners.push({ callback, limit });
    },

    // =====================
    // UTILITIES & POLLING
    // =====================

    offAll() {
        this.colaboradoresListeners = [];
        this.coberturasListeners = [];
        this.atividadesListeners = [];
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    },

    startPolling() {
        if (this.pollInterval) return;
        this.updateConnectionUI(true);
        this.poll(); // Executa imediatamente
        this.pollInterval = setInterval(() => this.poll(), 10000); // Repete a cada 10s
    },

    async poll() {
        try {
            // Atualiza Colaboradores
            if (this.colaboradoresListeners.length > 0) {
                const colabs = await this.request('colaboradores.json');
                const list = colabs ? Object.entries(colabs).map(([id, val]) => ({ id, ...val })) : [];
                this.colaboradoresListeners.forEach(cb => cb(list));
            }
            
            // Atualiza Coberturas
            if (this.coberturasListeners.length > 0) {
                const cober = await this.request('coberturas.json');
                const list = cober ? Object.entries(cober).map(([id, val]) => ({ id, ...val })) : [];
                this.coberturasListeners.forEach(cb => cb(list));
            }

            // Atualiza Atividades
            if (this.atividadesListeners.length > 0) {
                const limit = this.atividadesListeners[0].limit || 30;
                // Como não estamos usando SDK, baixamos as atividades e filtramos no cliente
                const acts = await this.request('atividades.json');
                let list = acts ? Object.entries(acts).map(([id, val]) => ({ id, ...val })) : [];
                
                // Ordena pelas mais recentes
                list.sort((a, b) => b.timestamp - a.timestamp);
                
                // Limita aos últimos X registros
                list = list.slice(0, limit);
                
                this.atividadesListeners.forEach(l => l.callback(list));
            }
        } catch (e) {
            // O erro já é tratado no this.request (mostrando "Offline")
        }
    }
};
