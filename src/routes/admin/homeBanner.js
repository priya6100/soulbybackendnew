const express = require('express');
const { upload, requireSignin, adminMiddleware } = require('../../common-middleware');
const { getHomePage, createHomePage, deleteBanner, updateHomeBanner } = require('../../controllers/admin/homeBanner');

const router = express.Router();



router.post('/homebanner/create', requireSignin, adminMiddleware, upload.fields([
    {name: 'banners'}
   

]),createHomePage);

router.get('/gethomebanner', getHomePage);

router.post('/deleteBanner', deleteBanner);
router.post('/updateHomeBanner', updateHomeBanner)
module.exports = router;