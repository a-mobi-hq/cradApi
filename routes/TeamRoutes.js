// routes/UserRoutes.js

const express = require('express');
const { createTeam, getTeamById ,login, signup, getTeamMembersByProjectId,getTeamProjectsByUserId,deleteTeamMember} = require('../controllers/TeamController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', AuthRoutes.verifyTokenUser,createTeam);
router.get('/:id',  AuthRoutes.verifyTokenUser,getTeamMembersByProjectId);
router.get('/user/:id',  AuthRoutes.verifyTokenUser,getTeamProjectsByUserId);
router.post('/login', login);
router.post('/signup', signup);
router.delete('/:id', AuthRoutes.verifyTokenUser,deleteTeamMember);

module.exports = router;
