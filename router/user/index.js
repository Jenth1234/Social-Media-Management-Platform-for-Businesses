const express = require('express');
const router = express.Router();
const user_controller = require('../../controllers/user.Controller');
router.post('/register',user_controller.registerUser);
router.put('/editUser/:id',user_controller.editUser);
router.delete('/deleteUser/:id',user_controller.deleteUser);
router.get('/getUsers',user_controller.getUsers);

module.exports = router;