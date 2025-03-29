const API_URL = 'http://localhost:3000/api'; // Certifique-se de que esta URL está correta

export const api = {
    // Autenticação
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao registrar usuário');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao processar solicitação');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    // Dashboard
    getDashboardData: async () => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/dashboard`, {
                method: 'GET',
                headers
            });
            
            if (response.status === 401) {
                logout();
                throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
            }
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar dados do dashboard');
            }
            return data;
        } catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            throw error;
        }
    },
    
    getDashboardCharts: async () => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/dashboard/charts`, {
                method: 'GET',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar dados dos gráficos');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    // Equipamentos
    getEquipments: async () => {
        try {
            const headers = obterHeadersAutorizados(); // Certifique-se de que o token está sendo enviado
            const response = await fetch(`${API_URL}/equipment`, {
                method: 'GET',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar equipamentos');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    getEquipmentById: async (id) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/equipment/${id}`, {
                method: 'GET',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar equipamento');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    createEquipment: async (equipmentData) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/equipment`, {
                method: 'POST',
                headers,
                body: JSON.stringify(equipmentData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar equipamento');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    updateEquipment: async (id, equipmentData) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/equipment/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(equipmentData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao atualizar equipamento');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    deleteEquipment: async (id) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/equipment/${id}`, {
                method: 'DELETE',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao excluir equipamento');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    getEquipmentGroups: async () => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/equipment-groups`, {
                method: 'GET',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar grupos de equipamentos');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    getEquipmentStats: async () => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/equipment-stats`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao buscar estatísticas de equipamentos');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API getEquipmentStats:', error);
            throw error;
        }
    },

    // Locações
    getRentals: async () => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/rentals`, {
                method: 'GET',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar locações');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    getRentalById: async (id) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/rentals/${id}`, {
                method: 'GET',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar locação');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    createRental: async (rentalData) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/rentals`, {
                method: 'POST',
                headers,
                body: JSON.stringify(rentalData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar locação');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    finishRental: async (id, returnData) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/rentals/${id}/finish`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(returnData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao finalizar locação');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    getRentalStats: async () => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/rental-stats`, {
                method: 'GET',
                headers
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar estatísticas de locações');
            }
            return data;
        } catch (error) {
            console.error('Erro na API getRentalStats:', error);
            throw error;
        }
    },

    // Alunos
    getStudents: async () => {
        try {
            const response = await fetch('/api/students', {
                method: 'GET',
                headers: obterHeadersAutorizados(),
            });
            if (!response.ok) {
                throw new Error('Erro ao obter lista de alunos');
            }
            return await response.json();
        } catch (error) {
            console.error('Erro em getStudents:', error);
            throw error;
        }
    },
    
    searchStudents: async (query) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/students/search?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar alunos');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    getStudentById: async (id) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'GET',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar aluno');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    createStudent: async (studentData) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers,
                body: JSON.stringify(studentData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar aluno');
            }
            return data;
        } catch (error) {
            console.error('Erro em createStudent:', error);
            throw error;
        }
    },
    
    updateStudent: async (id, studentData) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(studentData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao atualizar aluno');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    
    deleteStudent: async (id) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'DELETE',
                headers
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao excluir aluno');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    getStudentStats: async () => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/students/stats`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao obter estatísticas de alunos');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro em getStudentStats:', error);
            throw error;
        }
    },

    // Professores
    getProfessors: async () => {
        try {
            const headers = obterHeadersAutorizados(); // Certifique-se de que o token está sendo enviado
            console.log('Enviando solicitação para /professors com headers:', headers);
            const response = await fetch(`${API_URL}/professors`, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao buscar professores');
            }

            const data = await response.json();
            console.log('Professores recebidos:', data.length); // Log do número de professores recebidos
            return data;
        } catch (error) {
            console.error('Erro na API getProfessors:', error.message || error);
            throw error;
        }
    },
    
    createProfessor: async (professorData) => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/professors`, {
                method: 'POST',
                headers,
                body: JSON.stringify(professorData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar professor');
            }
            return data;
        } catch (error) {
            console.error('Erro na API createProfessor:', error);
            throw error;
        }
    },

    getProfessorStats: async () => {
        try {
            const headers = obterHeadersAutorizados();
            const response = await fetch(`${API_URL}/professors/stats`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao obter estatísticas de professores');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro em getProfessorStats:', error);
            throw error;
        }
    }
};

// Adicionar a função obterHeadersAutorizados
function obterHeadersAutorizados() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}
