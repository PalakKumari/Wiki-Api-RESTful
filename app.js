const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
app.use(express.urlencoded({ extended: true }));

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Article = mongoose.model("Article", articleSchema);

//Chained route handlers.
app
  .route("/articles")
  //get method
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  //post method
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added new item");
      } else {
        res.send(err);
      }
    });
  })
  //delete Method
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Deleted successfully");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////////////////route handlers for specific articles/////////////////////////////////
app
  .route("/articles/:articleName")
  .get(function (req, res) {
    const articleName = req.params.articleName;
    Article.findOne({ title: articleName }, function (err, foundArticle) {
      if (!err) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No article matching the searched title found!");
        }
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleName },
      {
        title: req.body.title,
        content: req.body.content,
      },
      function (err, result) {
        if (!err) {
          res.send("successfully updated item" + result);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleName },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Updated successfully");
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleName }, function (err) {
      if (!err) {
        res.send("deleted successfully");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
