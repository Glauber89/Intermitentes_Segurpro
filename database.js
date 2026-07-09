// ============================================
// DATABASE.JS - Firebase CRUD & Real-time Listeners
// ============================================

const Database = {

    // =====================
    // COLABORADORES
    // =====================

    addColaborador(data) {
        const newRef = db.ref('colaboradores').push();
        const colaborador = {
            ...data,
            id: newRef.key,
            status: data.status || 'aguardando_convocacao',
            statusInfo: data.statusInfo || {},
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        };
        return newRef.set(colaborador).then(() => {
            Database.logActivity('cadastro', `${data.nome} cadastrado como ${data.funcao}`);
            return colaborador;
        });
    },

    updateColaborador(id, data) {
        return db.ref(`colaboradores/${id}`).update({
            ...data,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            Database.logActivity('edicao', `${data.nome || 'Colaborador'} atualizado`);
        });
    },

    deleteColaborador(id, nome) {
        return db.ref(`colaboradores/${id}`).remove().then(() => {
            Database.logActivity('exclusao', `${nome || 'Colaborador'} removido do sistema`);
        });
    },

    updateStatus(id, status, statusInfo = {}, nome = '') {
        return db.ref(`colaboradores/${id}`).update({
            status,
            statusInfo,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            const statusLabels = {
                trabalhando: 'Trabalhando',
                cobertura: 'Em Cobertura',
                aguardando_convocacao: 'Aguardando Convocação',
                ferias: 'Férias',
                afastado: 'Afastado',
                folga: 'Folga'
            };
            Database.logActivity('status', `${nome} → ${statusLabels[status] || status}`);
        });
    },

    onColaboradoresChanged(callback) {
        db.ref('colaboradores').on('value', (snapshot) => {
            const data = snapshot.val();
            const list = data
                ? Object.entries(data).map(([id, val]) => ({ id, ...val }))
                : [];
            callback(list);
        });
    },

    getColaboradorById(id) {
        return db.ref(`colaboradores/${id}`).once('value').then(snap => {
            const val = snap.val();
            return val ? { id, ...val } : null;
        });
    },

    // =====================
    // COBERTURAS
    // =====================

    addCobertura(data) {
        const newRef = db.ref('coberturas').push();
        const cobertura = {
            ...data,
            id: newRef.key,
            ativa: true,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        return newRef.set(cobertura).then(() => {
            Database.logActivity('cobertura',
                `${data.colaboradorNome} cobrindo ${data.substituindoNome} em ${data.mina}`);
            return cobertura;
        });
    },

    finalizarCobertura(id) {
        return db.ref(`coberturas/${id}`).update({
            ativa: false,
            finalizadoEm: firebase.database.ServerValue.TIMESTAMP
        });
    },

    deleteCobertura(id) {
        return db.ref(`coberturas/${id}`).remove();
    },

    onCoberturasChanged(callback) {
        db.ref('coberturas').on('value', (snapshot) => {
            const data = snapshot.val();
            const list = data
                ? Object.entries(data).map(([id, val]) => ({ id, ...val }))
                : [];
            callback(list);
        });
    },

    // =====================
    // ACTIVITY LOG
    // =====================

    logActivity(action, details) {
        const newRef = db.ref('atividades').push();
        return newRef.set({
            action,
            details,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    },

    onActivitiesChanged(callback, limit = 30) {
        db.ref('atividades')
            .orderByChild('timestamp')
            .limitToLast(limit)
            .on('value', (snapshot) => {
                const data = snapshot.val();
                const list = data
                    ? Object.entries(data).map(([id, val]) => ({ id, ...val })).reverse()
                    : [];
                callback(list);
            });
    },

    // =====================
    // UTILITIES
    // =====================

    offAll() {
        db.ref('colaboradores').off();
        db.ref('coberturas').off();
        db.ref('atividades').off();
    }
};
