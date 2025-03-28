const pool = require('../config/database');

const dashboardController = {
    // Obter estatísticas para o dashboard
    getDashboardStats: async (req, res) => {
        try {
            // Estatísticas de equipamentos
            const equipmentStats = await pool.query(`
                SELECT
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE status = 'disponivel') as disponiveis,
                    COUNT(*) FILTER (WHERE status = 'locado') as locados,
                    COUNT(*) FILTER (WHERE status = 'manutencao') as manutencao
                FROM equipment
            `);
            
            // Estatísticas de locações
            const rentalStats = await pool.query(`
                SELECT
                    COUNT(*) FILTER (WHERE status = 'ativo') as ativas,
                    COUNT(*) FILTER (WHERE status = 'atrasado') as atrasadas
                FROM rentals
            `);
            
            // Locações recentes
            const recentRentals = await pool.query(`
                SELECT r.id, r.start_date, r.expected_return_date, r.status,
                       s.name as student_name, e.name as equipment_name
                FROM rentals r
                LEFT JOIN students s ON r.student_id = s.id
                LEFT JOIN equipment e ON r.equipment_id = e.id
                WHERE r.status != 'finalizado'
                ORDER BY r.start_date DESC
                LIMIT 5
            `);
            
            res.json({
                totalEquipamentos: parseInt(equipmentStats.rows[0].total) || 0,
                equipamentosDisponiveis: parseInt(equipmentStats.rows[0].disponiveis) || 0,
                equipamentosLocados: parseInt(equipmentStats.rows[0].locados) || 0,
                equipamentosManutencao: parseInt(equipmentStats.rows[0].manutencao) || 0,
                locacoesAtivas: parseInt(rentalStats.rows[0].ativas) || 0,
                locacoesAtrasadas: parseInt(rentalStats.rows[0].atrasadas) || 0,
                locacoesRecentes: recentRentals.rows
            });
        } catch (error) {
            console.error('Erro ao buscar estatísticas do dashboard:', error);
            res.status(500).json({ message: 'Erro ao buscar estatísticas do dashboard' });
        }
    },
    
    // Obter dados para gráficos
    getChartData: async (req, res) => {
        try {
            // Locações por dia nos últimos 30 dias
            const rentalsByDay = await pool.query(`
                SELECT 
                    DATE_TRUNC('day', start_date)::date as date,
                    COUNT(*) as count
                FROM rentals
                WHERE start_date >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY DATE_TRUNC('day', start_date)::date
                ORDER BY date
            `);
            
            // Equipamentos por tipo
            const equipmentByType = await pool.query(`
                SELECT 
                    type,
                    COUNT(*) as count
                FROM equipment
                GROUP BY type
            `);
            
            // Locações por status
            const rentalsByStatus = await pool.query(`
                SELECT 
                    status,
                    COUNT(*) as count
                FROM rentals
                GROUP BY status
            `);
            
            res.json({
                rentalsByDay: rentalsByDay.rows,
                equipmentByType: equipmentByType.rows,
                rentalsByStatus: rentalsByStatus.rows
            });
        } catch (error) {
            console.error('Erro ao buscar dados para gráficos:', error);
            res.status(500).json({ message: 'Erro ao buscar dados para gráficos' });
        }
    }
};

module.exports = dashboardController;
