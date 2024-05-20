const express = require("express");
const router = express.Router();
const user_controller = require("../../controllers/user/user.Controller");
router.post("/register", user_controller.registerUser);
router.put("/editUser/:id", user_controller.editUser);
router.delete("/deleteUser/:id", user_controller.deleteUser);
router.get("/getUsers", user_controller.getUsers);
router.post("/loginUser", user_controller.login);

module.exports = router;
