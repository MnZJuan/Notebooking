const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');
const equipmentController = require('../controllers/equipment.controller');
const rentalController = require('../controllers/rental.controller');
const studentController = require('../controllers/student.controller');
const professorController = require('../controllers/professor.controller');

// Aplicar middleware de autenticação em todas as rotas
router.use(verifyToken);

// Rotas do Dashboard
router.get('/dashboard', dashboardController.getDashboardStats);
router.get('/dashboard/charts', dashboardController.getChartData);

// Rotas de Equipamentos
router.get('/equipment', equipmentController.getAllEquipment);
router.get('/equipment/:id', equipmentController.getEquipmentById);
router.post('/equipment', equipmentController.createEquipment);
router.put('/equipment/:id', equipmentController.updateEquipment);
router.delete('/equipment/:id', equipmentController.deleteEquipment);
router.get('/equipment-groups', equipmentController.getEquipmentGroups);
router.get('/equipment-stats', equipmentController.getEquipmentStats);

// Rotas de Locações
router.get('/rentals', rentalController.getAllRentals);
router.get('/rentals/:id', rentalController.getRentalById);
router.post('/rentals', rentalController.createRental);
router.put('/rentals/:id/finish', rentalController.finishRental);
router.put('/rentals/update-overdue', rentalController.updateOverdueRentals);
router.get('/rental-stats', rentalController.getRentalStats);

// Rotas de Alunos
router.get('/students', studentController.getAllStudents);
router.get('/students/search', studentController.searchStudents);
router.get('/students/:id', studentController.getStudentById);
router.post('/students', studentController.createStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);

// Rotas de Professores
router.get('/professors', professorController.getAllProfessors); // Remova o verifyToken temporariamente
router.post('/professors', professorController.createProfessor);

module.exports = router;
