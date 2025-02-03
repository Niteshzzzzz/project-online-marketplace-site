const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync')
const listingModel = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listing.js')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// index route
router.get('/', wrapAsync(listingController.index))

//show route
router.get('/show/:id', wrapAsync(listingController.showListing))

// new route
router.get('/new', isLoggedIn , listingController.renderListingForm)

// create route
router.post('/create', 
    // isLoggedIn , validateListing, 
    upload.single('url'),
    //  wrapAsync(listingController.createListing)
    (req, res) => {
        res.send(req.file)
    }
    )

// edit route
router.get('/edit/:id', isLoggedIn, isOwner , wrapAsync(listingController.renderEditForm))

// update route
router.put('/update/:id', isLoggedIn, isOwner , validateListing, wrapAsync(listingController.editListing))

// listing delete route
router.delete('/delete/:id', isLoggedIn, isOwner , wrapAsync(listingController.destroyListing))

module.exports = router;