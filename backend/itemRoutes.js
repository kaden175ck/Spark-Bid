const express = require('express');
const router = express.Router();
const itemController = require('./itemController');

// Route to create a new item listing
router.post('/create', itemController.createItem);

// Route to get a specific item by its ID
router.get('/:id', itemController.getItemById);

// Route to update an item listing
router.put('/update/:id', itemController.updateItem);

// Route to delete an item listing
router.delete('/delete/:id', itemController.deleteItem);

module.exports = router;
