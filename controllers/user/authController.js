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
  //