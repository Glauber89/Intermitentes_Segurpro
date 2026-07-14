// ============================================
// APP.JS - Main Application Logic
// ============================================

// ---- Constants ----
const MINAS = ['Cauê', 'Conceição', 'Periquito', 'Projetos Capital', 'DB'];

const TIPOS_CONTRATO = {
    ferista: 'Ferista',
    mensalista: 'Mensalista',
    intermitente: 'Intermitente'
};

const FUNCOES = {
    porteiro: 'Porteiro',
    vigilante_movel: 'Vigilante Móvel',
    vigilante_fixo: 'Vigilante Fixo'
};

const TURNOS = {
    diurno: 'Diurno',
    noturno: 'Noturno'
};

const STATUS_CONFIG = {
    trabalhando: { label: 'Trabalhando', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', color: 'success' },
    cobertura: { label: 'Cobertura', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>', color: 'info' },
    aguardando_convocacao: { label: 'Aguardando', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>', color: 'warning' },
    ferias: { label: 'Férias', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', color: 'purple' },
    afastado: { label: 'Afastado', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>', color: 'danger' },
    folga: { label: 'Folga', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/></svg>', color: 'gray' }
};

const ACTIVITY_ICONS = {
    cadastro: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
    edicao: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"/></svg>',
    exclusao: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    status: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    cobertura: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>'
};

// ---- Application State ----
const App = {
    currentPage: 'dashboard',
    colaboradores: [],
    coberturas: [],
    activities: [],
    deleteCallback: null,

    // ---- Initialization ----
    init() {
        this.setupNavigation();
        this.setupModals();
        this.setupForms();
        this.setupFilters();
        this.setupFirebaseListeners();
        initConnectionMonitor();
    },

    // ---- Navigation ----
    setupNavigation() {
        // Sidebar nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.dataset.page);
                this.closeSidebar();
            });
        });

        // Bottom nav
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.dataset.page);
            });
        });

        // Mobile menu toggle
        document.getElementById('menu-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Sidebar overlay close
        document.getElementById('sidebar-overlay').addEventListener('click', () => {
            this.closeSidebar();
        });
    },

    navigateTo(page) {
        this.currentPage = page;

        // Update active states
        document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Show correct page
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update title
        const titles = {
            dashboard: 'Dashboard',
            colaboradores: 'Colaboradores',
            alocacao: 'Alocação',
            coberturas: 'Coberturas'
        };
        document.getElementById('page-title').textContent = titles[page] || page;
    },

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('sidebar-overlay').classList.toggle('open');
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('open');
    },

    // ---- Modal Management ----
    setupModals() {
        // Close buttons
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal(btn.dataset.close);
            });
        });

        // Close on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('open');
                }
            });
        });

        // Add Colaborador button
        document.getElementById('btn-add-colaborador').addEventListener('click', () => {
            this.openColaboradorModal();
        });

        // Add Cobertura button
        document.getElementById('btn-add-cobertura').addEventListener('click', () => {
            this.openCoberturaModal();
        });

        // Confirm delete button
        document.getElementById('btn-confirm-delete').addEventListener('click', () => {
            const pwd = document.getElementById('confirm-password').value;
            if (pwd !== 'admin123') {
                this.showToast('Senha incorreta!', 'error');
                return;
            }

            if (this.deleteCallback) {
                this.deleteCallback();
                this.deleteCallback = null;
            }
            this.closeModal('modal-confirm');
        });

        // Delete Colaborador button (in form)
        const btnDeleteColab = document.getElementById('btn-delete-colab');
        if (btnDeleteColab) {
            btnDeleteColab.addEventListener('click', () => {
                const id = document.getElementById('colab-id').value;
                if (id) {
                    this.promptDeleteColaborador(id);
                }
            });
        }
    },

    openModal(id) {
        document.getElementById(id).classList.add('open');
    },

    closeModal(id) {
        document.getElementById(id).classList.remove('open');
    },

    // ---- Forms ----
    setupForms() {
        // Colaborador form
        document.getElementById('form-colaborador').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleColaboradorSubmit();
        });

        // Status form
        document.getElementById('form-status').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleStatusSubmit();
        });

        // Status select - toggle dynamic fields
        document.getElementById('status-select').addEventListener('change', (e) => {
            this.toggleStatusFields(e.target.value);
        });

        // Cobertura form
        document.getElementById('form-cobertura').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCoberturaSubmit();
        });
    },

    // ---- Filters ----
    setupFilters() {
        // Colaboradores filters
        const colabFilterIds = ['search-colaboradores', 'filter-tipo', 'filter-funcao', 'filter-mina'];
        colabFilterIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => this.renderColaboradores());
                el.addEventListener('change', () => this.renderColaboradores());
            }
        });

        // Alocação filters
        const alocFilterIds = ['search-alocacao', 'filter-alocacao-status', 'filter-alocacao-turno', 'filter-alocacao-mina'];
        alocFilterIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => this.renderAlocacao());
                el.addEventListener('change', () => this.renderAlocacao());
            }
        });

        // Coberturas filter
        const cobFilter = document.getElementById('filter-cobertura-status');
        if (cobFilter) {
            cobFilter.addEventListener('change', () => this.renderCoberturas());
        }
    },

    // ---- Firebase Listeners ----
    setupFirebaseListeners() {
        Database.onColaboradoresChanged((list) => {
            this.colaboradores = list;
            this.renderDashboard();
            this.renderColaboradores();
            this.renderAlocacao();
        });

        Database.onCoberturasChanged((list) => {
            this.coberturas = list;
            this.renderCoberturas();
            this.renderDashboard();
        });

        Database.onActivitiesChanged((list) => {
            this.activities = list;
            this.renderActivities();
        });
    },

    // ============================================
    // RENDERING
    // ============================================

    // ---- Dashboard ----
    renderDashboard() {
        const counts = {
            trabalhando: 0,
            cobertura: 0,
            aguardando_convocacao: 0,
            ferias: 0,
            afastado: 0,
            folga: 0
        };

        this.colaboradores.forEach(c => {
            if (counts.hasOwnProperty(c.status)) {
                counts[c.status]++;
            }
        });

        // Update stat cards
        Object.keys(counts).forEach(key => {
            const el = document.getElementById(`stat-${key === 'aguardando_convocacao' ? 'aguardando' : key}`);
            if (el) {
                const currentVal = parseInt(el.textContent) || 0;
                if (currentVal !== counts[key]) {
                    el.textContent = counts[key];
                    el.style.transform = 'scale(1.2)';
                    setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
                }
            }
        });

        // Mines overview
        this.renderMinesGrid();
    },

    renderMinesGrid() {
        const grid = document.getElementById('mines-grid');
        if (!grid) return;

        const mineData = MINAS.map(mina => {
            const colabs = this.colaboradores.filter(c => {
                const minaAtual = c.statusInfo?.mina || c.minaPadrao;
                return minaAtual === mina;
            });

            const statusCounts = {};
            colabs.forEach(c => {
                statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
            });

            return { nome: mina, total: colabs.length, statusCounts };
        });

        grid.innerHTML = mineData.map(mine => `
            <div class="mine-card">
                <div class="mine-card-header">
                    <span class="mine-card-name"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${mine.nome}</span>
                    <span class="mine-card-total">${mine.total} colaboradores</span>
                </div>
                <div class="mine-card-stats">
                    ${Object.entries(mine.statusCounts).map(([status, count]) => {
                        const cfg = STATUS_CONFIG[status];
                        return cfg ? `<span class="mine-stat-tag" onclick="App.filterAlocacaoByStatusAndMine('${status}', '${mine.nome}')" style="cursor:pointer;" title="Filtrar por ${cfg.label} em ${mine.nome}">${cfg.icon} ${count} ${cfg.label}</span>` : '';
                    }).join('')}
                    ${Object.keys(mine.statusCounts).length === 0 ? '<span class="mine-stat-tag">Nenhum alocado</span>' : ''}
                </div>
            </div>
        `).join('');
    },

    renderActivities() {
        const list = document.getElementById('activity-list');
        if (!list) return;

        if (this.activities.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhuma atividade registrada</p>';
            return;
        }

        list.innerHTML = this.activities.map(act => {
            const icon = ACTIVITY_ICONS[act.action] || '📝';
            const time = act.timestamp ? this.formatTimeAgo(act.timestamp) : '';

            return `
                <div class="activity-item">
                    <div class="activity-icon">${icon}</div>
                    <div class="activity-content" style="flex:1;">
                        <div class="activity-text">${this.escapeHtml(act.details)}</div>
                        <div class="activity-time">${time}</div>
                    </div>
                    <button class="btn-icon" onclick="App.promptDeleteActivity('${act.id}')" title="Excluir" style="color:var(--text-muted); opacity: 0.5; transition: 0.2s;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            `;
        }).join('');
    },

    // ---- Colaboradores ----
    renderColaboradores() {
        const container = document.getElementById('colaboradores-list');
        const countEl = document.getElementById('colaboradores-count');
        if (!container) return;

        const filtered = this.getFilteredColaboradores();

        if (countEl) {
            countEl.textContent = `${filtered.length} de ${this.colaboradores.length} colaboradores`;
        }

        if (filtered.length === 0) {
            container.innerHTML = '<p class="empty-state">Nenhum colaborador encontrado</p>';
            return;
        }

        container.innerHTML = filtered.map(c => `
            <div class="colab-card" data-id="${c.id}">
                <div class="colab-card-header">
                    <div>
                        <div class="colab-name">${this.escapeHtml(c.nome)}</div>
                        ${c.matricula ? `<div class="colab-matricula">Matrícula: ${this.escapeHtml(c.matricula)}</div>` : ''}
                    </div>
                    <div class="colab-card-actions">
                        <button class="btn-icon" title="Editar" onclick="App.editColaborador('${c.id}')">✏️</button>
                        <button class="btn-icon" title="Excluir" onclick="App.confirmDeleteColaborador('${c.id}', '${this.escapeHtml(c.nome)}')">🗑️</button>
                    </div>
                </div>
                ${c.telefone ? `<div class="colab-telefone">📞 ${this.escapeHtml(c.telefone)}</div>` : ''}
                <div class="colab-tags">
                    <span class="tag tag-tipo">${TIPOS_CONTRATO[c.tipoContrato] || c.tipoContrato}</span>
                    <span class="tag tag-funcao">${FUNCOES[c.funcao] || c.funcao}</span>
                    <span class="tag tag-turno-${c.turnoPadrao}">${c.turnoPadrao === 'diurno' ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'} ${TURNOS[c.turnoPadrao] || c.turnoPadrao}</span>
                    <span class="tag tag-mina"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${this.escapeHtml(c.minaPadrao)}</span>
                    ${c.supervisor ? `<span class="tag tag-supervisor"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${this.escapeHtml(c.supervisor)}</span>` : ''}
                </div>
                <div class="colab-status-row">
                    ${this.renderStatusBadge(c.status)}
                    ${this.renderStatusDetail(c)}
                </div>
            </div>
        `).join('');
    },

    getFilteredColaboradores() {
        const search = (document.getElementById('search-colaboradores')?.value || '').toLowerCase().trim();
        const tipo = document.getElementById('filter-tipo')?.value || '';
        const funcao = document.getElementById('filter-funcao')?.value || '';
        const mina = document.getElementById('filter-mina')?.value || '';

        return this.colaboradores.filter(c => {
            if (search && !(c.nome?.toLowerCase().includes(search) || c.matricula?.toLowerCase().includes(search))) return false;
            if (tipo && c.tipoContrato !== tipo) return false;
            if (funcao && c.funcao !== funcao) return false;
            if (mina && c.minaPadrao !== mina) return false;
            return true;
        });
    },

    // ---- Alocação ----
    renderAlocacao() {
        const container = document.getElementById('alocacao-list');
        if (!container) return;

        const filtered = this.getFilteredAlocacao();

        if (filtered.length === 0) {
            container.innerHTML = '<p class="empty-state">Nenhum colaborador encontrado</p>';
            return;
        }

        container.innerHTML = filtered.map(c => {
            const statusCfg = STATUS_CONFIG[c.status] || {};
            return `
                <div class="alocacao-card" onclick="App.openStatusModal('${c.id}')">
                    <div class="alocacao-header">
                        <span class="alocacao-name">${this.escapeHtml(c.nome)}</span>
                        ${this.renderStatusBadge(c.status)}
                    </div>
                    <div class="alocacao-info">
                        <span class="tag tag-funcao">${FUNCOES[c.funcao] || c.funcao}</span>
                        <span class="tag tag-turno-${c.turnoPadrao}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> ${TURNOS[c.turnoPadrao] || ''}</span>
                        <span class="tag tag-mina">📍 ${this.escapeHtml(c.statusInfo?.mina || c.minaPadrao)}</span>
                        ${c.supervisor ? `<span class="tag tag-supervisor">👤 Sup: ${this.escapeHtml(c.supervisor)}</span>` : ''}
                    </div>
                    ${this.renderStatusDetail(c) ? `<div class="alocacao-detail">${this.renderStatusDetail(c)}</div>` : ''}
                </div>
            `;
        }).join('');
    },

    filterAlocacaoByStatusAndMine(status, mina) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));

        document.getElementById('page-alocacao').classList.add('active');
        document.querySelectorAll(`[data-page="alocacao"]`).forEach(item => item.classList.add('active'));
        
        const statusFilter = document.getElementById('filter-alocacao-status');
        const minaFilter = document.getElementById('filter-alocacao-mina');
        if (statusFilter) statusFilter.value = status;
        if (minaFilter) minaFilter.value = mina;
        
        this.renderAlocacao();
    },

    getFilteredAlocacao() {
        const search = (document.getElementById('search-alocacao')?.value || '').toLowerCase().trim();
        const status = document.getElementById('filter-alocacao-status')?.value || '';
        const turno = document.getElementById('filter-alocacao-turno')?.value || '';
        const mina = document.getElementById('filter-alocacao-mina')?.value || '';

        return this.colaboradores.filter(c => {
            if (search && !(c.nome?.toLowerCase().includes(search))) return false;
            if (status && c.status !== status) return false;
            if (turno && c.turnoPadrao !== turno) return false;
            if (mina) {
                const minaAtual = c.statusInfo?.mina || c.minaPadrao;
                if (minaAtual !== mina) return false;
            }
            return true;
        });
    },

    // ---- Coberturas ----
    renderCoberturas() {
        const container = document.getElementById('coberturas-list');
        if (!container) return;

        const filterStatus = document.getElementById('filter-cobertura-status')?.value || '';
        let filtered = [...this.coberturas];

        if (filterStatus === 'ativa') {
            filtered = filtered.filter(c => c.ativa);
        } else if (filterStatus === 'finalizada') {
            filtered = filtered.filter(c => !c.ativa);
        }

        if (filtered.length === 0) {
            container.innerHTML = '<p class="empty-state">Nenhuma cobertura registrada</p>';
            return;
        }

        container.innerHTML = filtered.map(cob => `
            <div class="cobertura-card ${cob.ativa ? '' : 'finalizada'}">
                <div class="cobertura-header">
                    <span class="cobertura-status-tag ${cob.ativa ? 'ativa' : 'finalizada'}">
                        ${cob.ativa ? '● Ativa' : '● Finalizada'}
                    </span>
                    <span style="font-size:0.7rem; color:var(--text-muted)">${cob.createdAt ? this.formatTimeAgo(cob.createdAt) : ''}</span>
                </div>
                <div class="cobertura-flow">
                    <div class="cobertura-person">
                        <div class="cobertura-person-name">${this.escapeHtml(cob.colaboradorNome)}</div>
                        <div class="cobertura-person-role">Cobrindo</div>
                    </div>
                    <span class="cobertura-arrow">→</span>
                    <div class="cobertura-person">
                        <div class="cobertura-person-name">${this.escapeHtml(cob.substituindoNome)}</div>
                        <div class="cobertura-person-role">Substituído</div>
                    </div>
                </div>
                <div class="cobertura-details">
                    <span class="tag tag-mina">📍 ${this.escapeHtml(cob.mina)}</span>
                    <span class="tag tag-turno-${cob.turno}">${cob.turno === 'diurno' ? '☀️' : '🌙'} ${TURNOS[cob.turno] || ''}</span>
                </div>
                ${cob.motivo ? `<div style="font-size:0.8rem; color:var(--text-muted); margin-top:8px;">📝 ${this.escapeHtml(cob.motivo)}</div>` : ''}
                <div class="cobertura-actions">
                    ${cob.ativa ? `<button class="btn btn-sm btn-secondary" onclick="App.finalizarCobertura('${cob.id}')">✅ Finalizar</button>` : ''}
                    <button class="btn btn-sm btn-danger" onclick="App.confirmDeleteCobertura('${cob.id}')">🗑️ Excluir</button>
                </div>
            </div>
        `).join('');
    },

    // ============================================
    // STATUS HELPERS
    // ============================================

    renderStatusBadge(status) {
        const cfg = STATUS_CONFIG[status];
        if (!cfg) return '';
        return `<span class="status-badge status-${status}">${cfg.icon} ${cfg.label}</span>`;
    },

    renderStatusDetail(colab) {
        if (!colab.statusInfo) return '';

        const info = colab.statusInfo;
        const parts = [];

        if (colab.status === 'trabalhando' || colab.status === 'cobertura') {
            if (info.mina) parts.push(`📍 ${info.mina}`);
            if (info.turno) parts.push(`${info.turno === 'diurno' ? '☀️' : '🌙'} ${TURNOS[info.turno] || info.turno}`);
        }

        if (colab.status === 'cobertura' && info) {
            let details = [];
            if (info.mina) details.push(`em <strong>${this.escapeHtml(info.mina)}</strong>`);
            if (info.turno) details.push(`(${TURNOS[info.turno] || info.turno})`);
            if (info.substituindo) details.push(`cobrindo <strong>${this.escapeHtml(info.substituindo)}</strong>`);
            if (info.supervisor) details.push(`- Sup: <strong>${this.escapeHtml(info.supervisor)}</strong>`);
            if (info.motivo) details.push(`- Motivo: ${this.escapeHtml(info.motivo)}`);
            return `<span class="status-detail">${details.join(' ')}</span>`;
        }

        if (colab.status === 'ferias') {
            if (info.inicio) parts.push(`Início: ${this.formatDate(info.inicio)}`);
            if (info.fim) parts.push(`Fim: ${this.formatDate(info.fim)}`);
        }

        if (info.observacao) {
            parts.push(`📝 ${info.observacao}`);
        }

        return parts.length > 0 ? `<span class="status-detail">${parts.join(' · ')}</span>` : '';
    },

    // ============================================
    // FORM HANDLERS
    // ============================================

    // ---- Colaborador Modal ----
    openColaboradorModal(id = null) {
        const form = document.getElementById('form-colaborador');
        const title = document.getElementById('modal-colaborador-title');
        const btnDelete = document.getElementById('btn-delete-colab');
        
        form.reset();
        document.getElementById('colab-id').value = '';

        if (id) {
            const colab = this.colaboradores.find(c => c.id === id);
            if (!colab) return;

            title.textContent = 'Editar Colaborador';
            if (btnDelete) btnDelete.classList.remove('hidden');
            document.getElementById('colab-id').value = id;
            document.getElementById('colab-nome').value = colab.nome || '';
            document.getElementById('colab-matricula').value = colab.matricula || '';
            document.getElementById('colab-telefone').value = colab.telefone || '';
            document.getElementById('colab-tipo').value = colab.tipoContrato || '';
            document.getElementById('colab-funcao').value = colab.funcao || '';
            document.getElementById('colab-turno').value = colab.turnoPadrao || '';
            document.getElementById('colab-mina').value = colab.minaPadrao || '';
            document.getElementById('colab-supervisor').value = colab.supervisor || '';
        } else {
            title.textContent = 'Novo Colaborador';
            if (btnDelete) btnDelete.classList.add('hidden');
        }

        this.openModal('modal-colaborador');
    },

    handleColaboradorSubmit() {
        const id = document.getElementById('colab-id').value;
        const data = {
            nome: document.getElementById('colab-nome').value.trim(),
            matricula: document.getElementById('colab-matricula').value.trim(),
            telefone: document.getElementById('colab-telefone').value.trim(),
            tipoContrato: document.getElementById('colab-tipo').value,
            funcao: document.getElementById('colab-funcao').value,
            turnoPadrao: document.getElementById('colab-turno').value,
            minaPadrao: document.getElementById('colab-mina').value,
            supervisor: document.getElementById('colab-supervisor').value
        };

        if (!data.nome) {
            this.showToast('Preencha o nome do colaborador', 'error');
            return;
        }

        if (id) {
            Database.updateColaborador(id, data)
                .then(() => {
                    this.showToast('Colaborador atualizado com sucesso!', 'success');
                    this.closeModal('modal-colaborador');
                })
                .catch(err => this.showToast('Erro ao atualizar: ' + err.message, 'error'));
        } else {
            Database.addColaborador(data)
                .then(() => {
                    this.showToast('Colaborador cadastrado com sucesso!', 'success');
                    this.closeModal('modal-colaborador');
                })
                .catch(err => this.showToast('Erro ao cadastrar: ' + err.message, 'error'));
        }
    },

    editColaborador(id) {
        this.openColaboradorModal(id);
    },

    promptDeleteColaborador(id) {
        const colab = this.colaboradores.find(c => c.id === id);
        if (!colab) return;

        document.getElementById('confirm-message').textContent = `Tem certeza que deseja excluir o colaborador(a) ${colab.nome}?`;
        document.getElementById('confirm-password').value = '';
        
        this.deleteCallback = () => {
            Database.deleteColaborador(id, colab.nome)
                .then(() => {
                    this.showToast('Colaborador excluído com sucesso!', 'success');
                    this.closeModal('modal-colaborador');
                })
                .catch(err => this.showToast('Erro ao excluir: ' + err.message, 'error'));
        };
        this.openModal('modal-confirm');
    },

    promptDeleteActivity(id) {
        document.getElementById('confirm-message').textContent = 'Tem certeza que deseja apagar este registro de atividade?';
        document.getElementById('confirm-password').value = '';
        
        this.deleteCallback = () => {
            Database.deleteActivity(id)
                .then(() => this.showToast('Atividade apagada!', 'success'))
                .catch(err => this.showToast('Erro ao apagar: ' + err.message, 'error'));
        };
        this.openModal('modal-confirm');
    },

    // ---- Status Modal ----
    openStatusModal(id) {
        const colab = this.colaboradores.find(c => c.id === id);
        if (!colab) return;

        document.getElementById('status-colab-id').value = id;
        document.getElementById('status-colab-nome').textContent = colab.nome;
        document.getElementById('status-select').value = colab.status || '';
        document.getElementById('status-obs').value = colab.statusInfo?.observacao || '';

        // Populate current values if they exist
        if (colab.statusInfo) {
            if (colab.statusInfo.mina) {
                document.getElementById('status-mina').value = colab.statusInfo.mina;
                document.getElementById('status-cob-mina').value = colab.statusInfo.mina;
            }
            if (colab.statusInfo.turno) {
                document.getElementById('status-turno').value = colab.statusInfo.turno;
                document.getElementById('status-cob-turno').value = colab.statusInfo.turno;
            }
            if (colab.statusInfo.substituindo) {
                document.getElementById('status-cobrindo').value = colab.statusInfo.substituindo;
            }
            if (colab.statusInfo.motivo) {
                document.getElementById('status-motivo').value = colab.statusInfo.motivo;
            }
            if (colab.statusInfo.supervisor) {
                document.getElementById('status-cob-supervisor').value = colab.statusInfo.supervisor;
            }
            if (colab.statusInfo.inicio) {
                document.getElementById('status-ferias-inicio').value = colab.statusInfo.inicio;
            }
            if (colab.statusInfo.fim) {
                document.getElementById('status-ferias-fim').value = colab.statusInfo.fim;
            }
        }

        this.toggleStatusFields(colab.status);
        this.openModal('modal-status');
    },

    toggleStatusFields(status) {
        document.querySelectorAll('.status-fields').forEach(el => el.classList.add('hidden'));

        if (status === 'trabalhando') {
            document.getElementById('status-fields-trabalhando').classList.remove('hidden');
        } else if (status === 'cobertura') {
            document.getElementById('status-fields-cobertura').classList.remove('hidden');
        } else if (status === 'ferias') {
            document.getElementById('status-fields-ferias').classList.remove('hidden');
        }
    },

    handleStatusSubmit() {
        const id = document.getElementById('status-colab-id').value;
        const status = document.getElementById('status-select').value;
        const colab = this.colaboradores.find(c => c.id === id);

        if (!status) {
            this.showToast('Selecione um status', 'error');
            return;
        }

        const statusInfo = {
            observacao: document.getElementById('status-obs').value.trim()
        };

        if (status === 'trabalhando') {
            statusInfo.mina = document.getElementById('status-mina').value;
            statusInfo.turno = document.getElementById('status-turno').value;
        } else if (status === 'cobertura') {
            statusInfo.mina = document.getElementById('status-cob-mina').value;
            statusInfo.turno = document.getElementById('status-cob-turno').value;
            statusInfo.substituindo = document.getElementById('status-cobrindo').value.trim();
            statusInfo.supervisor = document.getElementById('status-cob-supervisor').value;
            statusInfo.motivo = document.getElementById('status-motivo').value;
        } else if (status === 'ferias') {
            statusInfo.inicio = document.getElementById('status-ferias-inicio').value;
            statusInfo.fim = document.getElementById('status-ferias-fim').value;
        }

        Database.updateStatus(id, status, statusInfo, colab?.nome || '')
            .then(() => {
                this.showToast('Status atualizado!', 'success');
                this.closeModal('modal-status');
            })
            .catch(err => this.showToast('Erro ao atualizar: ' + err.message, 'error'));
    },

    // ---- Cobertura Modal ----
    openCoberturaModal() {
        const form = document.getElementById('form-cobertura');
        form.reset();

        // Populate collaborator selects
        const colabSelect = document.getElementById('cob-colaborador');
        const substSelect = document.getElementById('cob-substituindo');

        const optionsHtml = this.colaboradores
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map(c => `<option value="${c.id}">${this.escapeHtml(c.nome)} (${FUNCOES[c.funcao] || c.funcao})</option>`)
            .join('');

        colabSelect.innerHTML = '<option value="">Selecione...</option>' + optionsHtml;
        substSelect.innerHTML = '<option value="">Selecione...</option>' + optionsHtml;

        this.openModal('modal-cobertura');
    },

    handleCoberturaSubmit() {
        const colaboradorId = document.getElementById('cob-colaborador').value;
        const substituindoId = document.getElementById('cob-substituindo').value;
        const mina = document.getElementById('cob-mina').value;
        const turno = document.getElementById('cob-turno').value;
        const motivo = document.getElementById('cob-motivo').value.trim();

        if (!colaboradorId || !substituindoId || !mina || !turno) {
            this.showToast('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        const colaborador = this.colaboradores.find(c => c.id === colaboradorId);
        const substituindo = this.colaboradores.find(c => c.id === substituindoId);

        const data = {
            colaboradorId,
            colaboradorNome: colaborador?.nome || '',
            substituindoId,
            substituindoNome: substituindo?.nome || '',
            mina,
            turno,
            motivo
        };

        Database.addCobertura(data)
            .then(() => {
                // Also update the collaborator's status to "cobertura"
                Database.updateStatus(colaboradorId, 'cobertura', {
                    mina,
                    turno,
                    substituindo: substituindo?.nome || ''
                }, colaborador?.nome || '');

                this.showToast('Cobertura registrada!', 'success');
                this.closeModal('modal-cobertura');
            })
            .catch(err => this.showToast('Erro ao registrar: ' + err.message, 'error'));
    },

    finalizarCobertura(id) {
        Database.finalizarCobertura(id)
            .then(() => this.showToast('Cobertura finalizada!', 'success'))
            .catch(err => this.showToast('Erro: ' + err.message, 'error'));
    },

    confirmDeleteCobertura(id) {
        document.getElementById('confirm-message').textContent =
            'Tem certeza que deseja excluir esta cobertura?';
        this.deleteCallback = () => {
            Database.deleteCobertura(id)
                .then(() => this.showToast('Cobertura excluída', 'success'))
                .catch(err => this.showToast('Erro: ' + err.message, 'error'));
        };
        this.openModal('modal-confirm');
    },

    // ============================================
    // UTILITIES
    // ============================================

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        toast.innerHTML = `<span>${icon}</span><span>${this.escapeHtml(message)}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Agora mesmo';
        if (minutes < 60) return `${minutes}min atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days}d atrás`;

        const date = new Date(timestamp);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    },

    formatDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return dateStr;
    }
};

// ---- Start Application ----
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
