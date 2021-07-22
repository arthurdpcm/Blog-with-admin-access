const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify")
const adminAuth = require("../../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (req,res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then(articles =>{
        res.render("admin/articles/indexArticle.ejs",{articles:articles})
    })

});

router.get("/admin/articles/new",adminAuth, (req,res)=>{
    Category.findAll().then(categories=>{
        res.render("../views/admin/articles/new.ejs",
        {categories:categories});
    });
});

router.post("/articles/save",adminAuth,(req, res)=>{
    var title = req.body.title;
    var articleBody = req.body.articleBody;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body:articleBody,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles");
    })
})

router.post("/admin/articles/delete",adminAuth,(req,res)=>{
    var id = req.body.id;
    if(id!=undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/articles");
            })

        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles");
    }
})

router.get("/admin/articles/edit/:id",adminAuth, (req, res)=>{
    var id =req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/articles")
    }

    Article.findByPk(id).then(article =>{
        if(article != undefined){

            Category.findAll().then(categories=>{
                res.render("admin/articles/editArticle",{article:article, categories:categories})
            })
            

        }else{
            res.redirect("/admin/articles")
        }

    }).catch(error =>{
        res.redirect("/admin/articles")
    })

    
})

router.post("/articles/update",adminAuth, (req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var articleBody = req.body.articleBody;
    var category = req.body.category;

    Article.update({
        title:title,
        slug: slugify(title),
        body: articleBody,
        categoryId: category},
        {
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles")
    }).catch((msgError)=>{
        res.redirect("/admin/articles")
    })


})

router.get("/articles/page/:numPage", (req, res)=>{
    var page = req.params.numPage;
    var offset = 0;
    
    if(isNaN(page)){
        res.redirect("/")
    }
    else{
        offset=(parseInt(page)-1) * 5;
    }


    Article.findAndCountAll({
        limit:4,
        offset:offset,
        order: [
            ['id','DESC']
        ]
    }).then(articles=>{

        var next;

        if(page > articles.count/4){
            res.redirect("/")
        }

        if (offset + 5 >= articles.count){
            next = false;
        }else{
            next = true;
        }



        var result = {
            page:parseInt(page),
            next: next,
            articles:articles
        }

        Category.findAll().then(categories=>{
            res.render("admin/articles/pageArticle",{result : result, categories:categories});
        })
        
    })
    
})




module.exports = router;