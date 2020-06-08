const express = require('express')

const flash = require('connect-flash')
const session = require('express-session')

const expressLayouts = require('express-ejs-layouts')

const passport = require('passport')

const app = express()

require('./config/passport')(passport)

const {db, Users,Friends} = require('./config/db')

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

//global variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use(expressLayouts)
app.set('view engine','ejs')

app.use(express.urlencoded( {extended: false}))

app.use('/',require('./routes/index'))

app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 3000

db.sync().then(() =>{ 
    app.listen(PORT, console.log(`server started on ${PORT}`))
})
    .catch((err) => {
        console.error(err)
    })


