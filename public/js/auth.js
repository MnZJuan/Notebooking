// Verificar autenticação
function verificarAutenticacao() {
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', token); // Log para verificar o token

    if (!token) {
        // Redirecionar para login se não estiver autenticado
        window.location.href = '/index.html?auth=required';
        return false;
    }

    try {
        // Decodificar o token para verificar a data de expiração
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Payload do token:', payload); // Log do payload do token

        if (payload.exp < Date.now() / 1000) {
            console.warn('Token expirado');
            localStorage.removeItem('token');
            window.location.href = '/index.html?auth=expired';
            return false;
        }
    } catch (e) {
        console.error('Erro ao decodificar o token:', e);
        localStorage.removeItem('token');
        window.location.href = '/index.html?auth=invalid';
        return false;
    }

    return true;
}

// Configurar cabeçalho de autorização para requisições à API
function obterHeadersAutorizados() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token não encontrado. O usuário precisa estar autenticado.');
        return {};
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/index.html?logout=success';
}
