const { Router } = require('express');

const router = Router();

// Home
router.get('/home', (req, res) => {
  res.render('home');
});

// Productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// Carritos en tiempo real
router.get('/realtimecarts', (req, res) => {
  res.render('realTimeCarts');
});

module.exports = router;
