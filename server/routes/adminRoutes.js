const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/AdminController');

router.get('/stats', AuthMiddleware, getDashboardStats);

module.exports = router;
