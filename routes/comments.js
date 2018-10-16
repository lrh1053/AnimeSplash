var express = require("express");
var router  = express.Router({mergeParams: true});
var AnimeSplash = require("../models/animesplash");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find ANIMESPLASH by id
    console.log(req.params.id);
    AnimeSplash.findById(req.params.id, function(err, animesplash){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {animesplash: animesplash});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup animesplash using ID
   AnimeSplash.findById(req.params.id, function(err, animesplash){
       if(err){
           console.log(err);
           res.redirect("/animesplashs");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               animesplash.comments.push(comment);
               animesplash.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/animesplashs/' + animesplash._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {animesplash_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/animesplashs/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/animesplashs/" + req.params.id);
       }
    });
});

module.exports = router;