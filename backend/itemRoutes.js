const express = require('express');
const router = express.Router();
const itemController = require('./itemController');

router.get('/', itemController.getItems);
router.post('/', itemController.createItem);
router.get('/:id', itemController.getItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
