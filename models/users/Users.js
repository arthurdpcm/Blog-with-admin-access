const Sequelize = require("sequelize");
const connection = require("../../database/database");
const Category = require("../categories/Category");


// Article definition
const User = connection.define('users',{
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "This field can not be empty"
            }
        }
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "This field can not be empty"
            }
        }
    }
})

//Relationships


User.sync({force:false})

module.exports = User;