const express = require('express')

const router = express.Router()

const { ensureAuthenticated} = require('../config/off')

router.get('/', async(req,res) =>{
    res.render('welcome')
})

router.get('/dashboard', ensureAuthenticated ,(req,res) =>{
    res.render('dashboard', {
        name: req.user[0].username,
        Students: req.user[0].Students,
        email: req.user[0].email,
    })
})

module.exports = router 