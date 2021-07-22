const Sequelize = require("sequelize");
const connection = require("../../database/database");

const Category = connection.define('categories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "This field can not be empty"
            }
        }
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "This field can not be empty"
            }
        }
    }
})

Category.sync({force:false})

module.exports = Category;