const router = require('express').Router();
const {auth} = require('MTVProject/middlewares/auth');
const {register, login, profile, logout} = require('./views');
// ========= route ============
//  user register
router.post('/register/', register);
// user login
router.post('/login/', login);
// get logged in user
router.get('/profile/', auth, profile);
// logout user
router.get('/logout/', auth, logout);

module.exports = router;