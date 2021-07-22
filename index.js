//Imports
const express = require("express");
const app = express();
const bodyParser =require("body-parser");
const connection = require('./database/database');
const session = require("express-session");


const categoriesController = require('./models/categories/CategoriesController');
const articlesController = require('./models/articles/ArticlesController');
const usersController = require('./models/users/UsersController');

const Users = require('./models/users/Users');
const Article = require("./models/articles/Article");
const Category = require("./models/categories/Category");

//View engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Sessions

app.use(session({
    secret:"asdfajfpadkopkokopasdkp",
    cookie: {
        maxAge: 30000000
    }
}))


//Body Parser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



//Database

connection
    .authenticate()
    .then(()=>{
        console.log("Success connection!")
    })
    .catch((msgError)=>{
        console.log(msgError)
    })


//Routes



app.use("/", categoriesController)

app.use("/", articlesController)

app.use("/", usersController)



app.get("/", (req, res) =>{

    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 5
    }).then(articles =>{

        Category.findAll().then(categories =>{
            res.render("index",{articles:articles, categories:categories});
        })

        
    });
    
});

app.get("/article/:slug", (req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article",{article:article, categories:categories});
            })
        }else{
           res.redirect("/") ;
        }
    }).catch(msgError =>{
        res.redirect("/")
    })

})

app.get("/category/:slug", (req,res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug
        },
        include:[{model: Article}]

    }).then(category =>{
        if(category != undefined){
            
            Category.findAll().then(categories=>{
                res.render("indexCategoryPage", {articles: category.articles, categories:categories})
            })

        }else{
           res.redirect("/") ;
        }
    }).catch(msgError =>{
        res.redirect("/")
    })

})




app.listen(8080,()=>{
    console.log("The server is running at 8080!")
})