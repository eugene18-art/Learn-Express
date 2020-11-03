const router = require('express').Router();
const forum_app_api =  require('forum_app/api/urls');

router.use('/api/v1', forum_app_api);

module.exports = router;