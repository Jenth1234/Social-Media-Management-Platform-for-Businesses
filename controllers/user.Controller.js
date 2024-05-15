 

const user = require('../models/user/user.model'); 

exports.registerUser = async (req, res) => {
    try {
      const newUser = new user(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};
exports.editUser = async (req, res) => {
  try{
    const userId = req.params.id; 
    const userDataToUpdate = req.body; 
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    foundUser.set(userDataToUpdate);
    await foundUser.save();

    res.status(200).json(foundUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await user.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const users = await user.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
