const express = require("express");

const postController = require("../controllers/postController");
const protect = require("../middleware/authMiddleware")
const router = express.Router();

//localhost:4000/
router
.route("/")
.get(postController.getAllPosts)
.post(protect, postController.createPost);

router.route("/:id")
.get(postController.getOnePost)
.patch(postController.updatePost).delete(postController.deletePost);

module.exports = router;