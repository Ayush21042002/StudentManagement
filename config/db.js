const Sequelize = require('sequelize')

const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/test.db',
})

const Users = db.define('Users', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true,
    },
    password: {
        type: Sequelize.STRING(200),
        allowNull: false,
    }
})

const Students = db.define('Students', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
    },
    roll: {
        type: Sequelize.INTEGER,
        allowNull:false,
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING(100),
    },
    score1:{
        type: Sequelize.INTEGER,
    },

    score2: {
        type: Sequelize.INTEGER,
    },

    score3: {
        type: Sequelize.INTEGER,
    },

    score4: {
        type: Sequelize.INTEGER,
    },

    score5: {
        type: Sequelize.INTEGER,
    },
})

Users.hasMany(Students)
Students.belongsTo(Users)

module.exports = {
    db, Users,Students
}