
const user = require('../../models/user/user.model');
const USER_SERVICE = require('../../service/user/user.service');
const {checkUsernameExists} = require('../../models/user/validate/index')


exports.registerUser = async (req, res) => {
    try {
        const payload = req.body;
        
        // CHECK VALIDATE
        const {error} = checkUsernameExists.validate(payload)
        
        if(error){
          return res.status(400).json({ error: error.message });
        }
        // Kiểm tra xem username đã tồn tại chưa
        const existingUser = await USER_SERVICE.checkUsernameExists(payload.USERNAME);
        
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Nếu không tồn tại, tiếp tục tạo người dùng mới
        const newUser = await USER_SERVICE.registerUser(payload);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.editUser = async (req, res) => {
    try {
        const userId = req.params.id; 
        const userDataToUpdate = req.body; 
        const updatedUser = await USER_SERVICE.editUser(userId, userDataToUpdate);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await USER_SERVICE.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await USER_SERVICE.getUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
