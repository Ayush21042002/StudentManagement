const localStrategy = require('passport-local').Strategy
const {db,Users,Students} = require('./db')
const bcrypt = require('bcryptjs')

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: 'email'}, async (email,password,done) =>{
            //Match user

            const user = await Users.findAll({
                where:{
                    email: email
                },
                include: Students
            })

            if(!user){
                return done(null, false, { message: ' email is not registered' })
            }else{
                if (await bcrypt.compare(password, user[0].password))
                {
                    return done(null,user)
                }else{
                    return done(null,false, {message: 'password incorrect'})
                }
            }

        })
    )

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async(user, done) => {
        const user1 = await Users.findByPk(user[0].email)
        if(user1){
            done(null,user)
        }
    });

}

