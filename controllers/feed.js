const { validationResult } = require("express-validator/check");

const Post = require("../models/post");

const path = require("path");

const fs = require("fs");

//  The functions in this folder are used to seperate the business logic from the routes

// This function gets the  post data from the db, right now it is  pulling du my data which  is hard coded into the res.json()
exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 1;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        
    })
    .then((posts) => {
      res.status(200).json({
        message: "Fecthed posts successfully.",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// This function is creating a post and sending it to the db
exports.createPost = (req, res, next) => {
  // create  post in db
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "Juan Suarez" },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created succesfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        // if error code does not exist, add it
        err.statusCode = 500;
      }
      // Because we are in a  promise chain, throwing the error does not work. Use next() function.
      next(err);
    });

  // ERR Cant set headers after they  are  sent to the client
  // """
  // This  error occured because  the  previous  call makes a
  // server post and the  following  code attemtps to  do  so
  // as  well
  // """

  // res.status(201).json({
  //     message: 'Post created successfully!',
  //     post: {
  //         _id: new Date().toString(),
  //         createdAt: new Date()
  //     }
  // });
};

exports.getPost = (req, res, next) => {
  // The postId after params has to  match exactly the  postId in the  route variabel [router.get('/post/:postId');]
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        // Throwing  an  error in the then block is  okay because this is caught by the  catch block after.
        throw error;
      }
      res.status(200).json({ message: "Post fetched.", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error("No File picked.");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        // Throwing  an  error in the then block is  okay because this is caught by the  catch block after.
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post Updates!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      // Check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
