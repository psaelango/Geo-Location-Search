const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require('../controllers/user.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/details', protect, getUserInfo)

module.exports = router
