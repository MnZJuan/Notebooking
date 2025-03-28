class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('sidebar-overlay');
        this.toggleButtons = document.querySelectorAll('[data-sidebar-toggle]');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleProfileImage();
        this.setActiveMenuItem();
    }

    setupEventListeners() {
        this.toggleButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleSidebar());
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.toggleSidebar();
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('-translate-x-full');
        this.overlay.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    }

    isOpen() {
        return !this.sidebar.classList.contains('-translate-x-full');
    }
}

// Export for use in other files
export { SidebarManager };

/**
 * Componentes compartilhados para o sistema de Notebooking
 */

// Inicializa o comportamento da barra lateral responsiva
export function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileToggle = document.getElementById('mobile-toggle');
    const overlay = document.getElementById('sidebar-overlay');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-opened');
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('sidebar-opened');
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }
}

// Define qual item do menu está ativo baseado na página atual
export function setActiveMenuItem(page) {
    document.querySelectorAll('aside nav a').forEach(link => {
        if (link.href.includes(page)) {
            link.classList.add('bg-gray-700');
            link.classList.remove('hover:bg-gray-700');
        } else {
            link.classList.remove('bg-gray-700');
            link.classList.add('hover:bg-gray-700');
        }
    });
}

// Exibe o avatar do usuário ou iniciais
function handleProfileImage(userName, imageUrl) {
    const profileImage = document.getElementById('profile-image');
    const profileLetter = document.getElementById('profile-letter');
    const usernameDisplay = document.getElementById('username-display');
    
    if (usernameDisplay) {
        usernameDisplay.textContent = userName;
    }
    
    if (profileImage && profileLetter) {
        if (imageUrl && imageUrl.trim() !== '') {
            profileImage.src = imageUrl;
            profileImage.style.display = 'block';
            profileLetter.style.display = 'none';
        } else {
            profileImage.style.display = 'none';
            profileLetter.style.display = 'flex';
            
            // Pegar a primeira letra do nome
            if (userName && userName.length > 0) {
                profileLetter.textContent = userName.charAt(0).toUpperCase();
            } else {
                profileLetter.textContent = 'U';
            }
        }
    }
}

// Função para exibir mensagem de notificação
function showNotification(message, type = 'success') {
    // Criar o elemento de notificação
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    } text-white`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' :
                type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
                type === 'warning' ? '<i class="fas fa-exclamation-triangle"></i>' :
                '<i class="fas fa-info-circle"></i>'}
            </span>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.add('opacity-0');
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Função para criar uma tabela de dados dinâmica
function createDataTable(containerId, columns, data, actions = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Limpar conteúdo existente
    container.innerHTML = '';
    
    // Criar tabela
    const table = document.createElement('table');
    table.className = 'min-w-full divide-y divide-gray-200';
    
    // Cabeçalho da tabela
    const thead = document.createElement('thead');
    thead.className = 'bg-gray-50';
    
    const headerRow = document.createElement('tr');
    columns.forEach(column => {
        const th = document.createElement('th');
        th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
        th.textContent = column.label;
        headerRow.appendChild(th);
    });
    
    // Se houver ações, adicionar coluna
    if (actions) {
        const th = document.createElement('th');
        th.className = 'px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider';
        th.textContent = 'Ações';
        headerRow.appendChild(th);
    }
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Corpo da tabela
    const tbody = document.createElement('tbody');
    tbody.className = 'bg-white divide-y divide-gray-200';
    
    // Se não houver dados
    if (!data || data.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.className = 'px-6 py-4 text-center text-gray-500';
        td.colSpan = columns.length + (actions ? 1 : 0);
        td.textContent = 'Nenhum registro encontrado';
        tr.appendChild(td);
        tbody.appendChild(tr);
    } else {
        data.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            
            columns.forEach(column => {
                const td = document.createElement('td');
                td.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
                
                // Se o valor for um callback de formatação
                if (typeof column.value === 'function') {
                    td.innerHTML = column.value(item);
                } else {
                    // Obter valor da propriedade, mesmo em objetos aninhados (ex: "user.name")
                    let value = item;
                    const props = column.value.split('.');
                    for (const prop of props) {
                        value = value?.[prop];
                    }
                    td.textContent = value || '';
                }
                
                tr.appendChild(td);
            });
            
            // Se houver ações, adicionar coluna
            if (actions) {
                const td = document.createElement('td');
                td.className = 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium';
                
                // Botões de ação
                actions.forEach(action => {
                    const btn = document.createElement('button');
                    btn.className = `ml-2 px-3 py-1 rounded ${action.class || 'bg-blue-500 text-white'}`;
                    btn.innerHTML = action.icon ? `<i class="${action.icon}"></i>` : action.label;
                    btn.title = action.label;
                    btn.addEventListener('click', () => action.onClick(item));
                    td.appendChild(btn);
                });
                
                tr.appendChild(td);
            }
            
            tbody.appendChild(tr);
        });
    }
    
    table.appendChild(tbody);
    container.appendChild(table);
    
    return table;
}
