const express = require('express');
const { getBinaryTreeController } = require('../controllers/treeController');

const router = express.Router();

router.get('/binary-tree/:userId', getBinaryTreeController);

module.exports = router;

 