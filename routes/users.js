const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const passport = require('passport')

const { db, Users, Students } = require('../config/db')

router.get('/login', async(req, res) => {
    res.render('login')
})

router.get('/register', async(req, res) => {
    res.render('register')
})

router.post('/register', async(req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'please fill in all fields' })
    }

    if (password != password2) {
        errors.push({ msg: 'passwords do not match' })
    }

    if (password.length < 6) {
        errors.push({ msg: 'password must be larger than 6 characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //validation pass
        const user = await Users.findByPk(email)

        if (user) {
            errors.push({ msg: 'user exists' })
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            })
        } else {
            const hashedpassword = await bcrypt.hash(password, 10)
            const newUser = await Users.create({
                username: name,
                email: email,
                password: hashedpassword
            })
            req.flash('success_msg', 'you are now registered and can log in');
            res.redirect('/users/login')
        }
    }

})

router.post('/login', async(req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'you are logged out')
    res.redirect('/users/login')
})

router.post('/student', async(req, res) => {
    const { roll, name, email, score1, score2, score3, score4, score5, teacheremail } = req.body

    const newstudent = await Students.create({
        roll: Number(roll),
        name: name,
        email: email,
        score1: Number(score1),
        score2: Number(score2),
        score3: Number(score3),
        score4: Number(score4),
        score5: Number(score5),
        UserEmail: teacheremail,
    })

    if (newstudent == null)
        res.status(400)

    const user = await Users.findAll({
        where: {
            email: teacheremail
        },
        include: Students
    })

    res.render('dashboard', {
        name: user[0].username,
        Students: user[0].Students,
        email: user[0].email,
    })

})

router.post('/updatestudent', async(req, res) => {
    const { roll, name, email, score1, score2, score3, score4, score5 } = req.body

    const student = await Students.findByPk(Number(roll))
    const teacheremail = student.UserEmail

    if (student == null)
        res.status(400)

    Students.update({
        roll: Number(roll),
        name: name,
        email: email,
        score1: Number(score1),
        score2: Number(score2),
        score3: Number(score3),
        score4: Number(score4),
        score5: Number(score5)
    }, { where: { roll: Number(student.roll) } }).error(err => {

        handleError(err)
        res.status(400);
    })

    const user = await Users.findAll({
        where: {
            email: teacheremail
        },
        include: Students
    })

    res.render('dashboard', {
        name: user[0].username,
        Students: user[0].Students,
        email: user[0].email,
    })
})

router.post('/deletestudent', async(req, res) => {
    const { roll, name, email } = req.body

    const student = await Students.findByPk(Number(roll))
    const teacheremail = student.UserEmail

    if (student == null)
        res.status(400)

    Students.destroy({
        where: {
            roll: Number(student.roll)
        }
    })

    const user = await Users.findAll({
        where: {
            email: teacheremail
        },
        include: Students
    })

    res.render('dashboard', {
        name: user[0].username,
        Students: user[0].Students,
        email: user[0].email,
    })
})

module.exports = router