const router = require('express').Router();
const friendRoutes = require('./friendRoutes');
const thoughtRoutes = require('./thoughtRoutes');
const userRoutes = require('./userRoutes')

router.use('/friends', friendRoutes);
router.use('/thougts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;
