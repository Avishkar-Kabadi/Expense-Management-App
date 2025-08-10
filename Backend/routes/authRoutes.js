const express = require('express');
const { registerUser, loginUser, getUser, updateUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();



router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/user', authMiddleware, getUser);

router.patch('/update-user', authMiddleware, updateUser);



module.exports = router;
