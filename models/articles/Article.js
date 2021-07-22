const Sequelize = require("sequelize");
const connection = require("../../database/database");
const Category = require("../categories/Category");


// Article definition
const Article = connection.define('articles',{
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
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "This field can not be empty"
            }
        }
    }
})

//Relationships

Category.hasMany(Article); // 1 CATEGORY HAS MANY ARTICLES, 1 TO MANY
Article.belongsTo(Category); // 1 ARTICLE BELONGS TO ON CATEGORY, 1 TO 1 RELATIONSHIP

Article.sync({force:false})

module.exports = Article;