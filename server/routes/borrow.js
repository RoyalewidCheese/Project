const express = require('express');
const router = express.Router();

router.get('/borrow', (req, res) => {
  res.render('borrow');
});

module.exports = router;
