var express = require("express");
var router  = express.Router();
var AnimeSplash = require("../models/animesplash");
var middleware = require("../middleware");


//INDEX - show all animesplashs
router.get("/", function(req, res){
    // Get all animesplashs from DB
    AnimeSplash.find({}, function(err, allAnimeSplashs){
       if(err){
           console.log(err);
       } else {
          res.render("animesplashs/index",{animesplashs:allAnimeSplashs});
       }
    });
});

//CREATE - add new animesplash to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to animesplashs array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newAnimeSplash = {name: name, image: image, description: desc, author:author}
    // Create a new animesplash and save to DB
    AnimeSplash.create(newAnimeSplash, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to animesplashs page
            console.log(newlyCreated);
            res.redirect("/animesplashs");
        }
    });
});

//NEW - show form to create new animesplash
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("animesplashs/new"); 
});

// SHOW - shows more info about one animesplash
router.get("/:id", function(req, res){
    //find the animesplash with provided ID
    AnimeSplash.findById(req.params.id).populate("comments").exec(function(err, foundAnimeSplash){
        if(err){
            console.log(err);
        } else {
            console.log(foundAnimeSplash)
            //render show template with that animesplash
            res.render("animesplashs/show", {animesplash: foundAnimeSplash});
        }
    });
});

// EDIT ANIMESPLASH ROUTE
router.get("/:id/edit", middleware.checkAnimeSplashOwnership, function(req, res){
    AnimeSplash.findById(req.params.id, function(err, foundAnimeSplash){
        res.render("animesplashs/edit", {animesplash: foundAnimeSplash});
    });
});

// UPDATE ANIMESPLASH ROUTE
router.put("/:id",middleware.checkAnimeSplashOwnership, function(req, res){
    // find and update the correct animesplash
    AnimeSplash.findByIdAndUpdate(req.params.id, req.body.animesplash, function(err, updatedAnimeSplash){
       if(err){
           res.redirect("/animesplashs");
       } else {
           //redirect somewhere(show page)
           res.redirect("/animesplashs/" + req.params.id);
       }
    });
});

// DESTROY ANIMESPLASH ROUTE
router.delete("/:id",middleware.checkAnimeSplashOwnership, function(req, res){
   AnimeSplash.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/animesplashs");
      } else {
          res.redirect("/animesplashs");
      }
   });
});


module.exports = router;

