/**
 * Funções utilitárias compartilhadas
 */

// Formatar data no padrão brasileiro
export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Formatar data e hora
export function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toHours().padStart(2, '0') + ':' + 
           date.getMinutes().padStart(2, '0');
}

// Formatar valor monetário
export function formatCurrency(value) {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Validar um objeto baseado em regras
export function validateObject(obj, rules) {
    const errors = {};
    
    for (const field in rules) {
        const value = obj[field];
        const rule = rules[field];
        
        // Verificar se é obrigatório
        if (rule.required && (value === null || value === undefined || value === '')) {
            errors[field] = rule.message || 'Este campo é obrigatório';
            continue;
        }
        
        // Se o campo é vazio e não obrigatório, não validar outras regras
        if (!value && !rule.required) continue;
        
        // Verificar comprimento mínimo
        if (rule.minLength && value.length < rule.minLength) {
            errors[field] = rule.message || `Mínimo de ${rule.minLength} caracteres`;
            continue;
        }
        
        // Verificar comprimento máximo
        if (rule.maxLength && value.length > rule.maxLength) {
            errors[field] = rule.message || `Máximo de ${rule.maxLength} caracteres`;
            continue;
        }
        
        // Verificar padrão (regex)
        if (rule.pattern && !rule.pattern.test(value)) {
            errors[field] = rule.message || 'Formato inválido';
            continue;
        }
        
        // Verificação personalizada
        if (rule.validate && typeof rule.validate === 'function') {
            const isValid = rule.validate(value, obj);
            if (!isValid) {
                errors[field] = rule.message || 'Campo inválido';
            }
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Buscar dados de usuário autenticado
export function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        // Decodificar payload do token JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        return {
            id: payload.id,
            exp: payload.exp
        };
    } catch (e) {
        return null;
    }
}

// Gerador de IDs únicos
export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Sanitizar texto para evitar XSS
export function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Debounce para evitar múltiplas chamadas de função
export function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

export const validateForm = (form) => {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('border-red-500');
        } else {
            field.classList.remove('border-red-500');
        }
    });

    return isValid;
};
