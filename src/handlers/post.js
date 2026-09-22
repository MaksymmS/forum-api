import * as PostService from '../services/post.js';

export const getPosts = async (req, res) => {
    try {
        const { category, take } = req.query;
        const posts = await PostService.getPosts(category, take) 
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
};

export const getPostsById = async (req, res) => {
    try {
        const { id } = req.params;
const post = await PostService.getPostById(id); 
        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content, author, category } = req.body;

        if (!title || !content) {
            return res.status(422).json({
                message: 'Title and content are required'
            });
        }
        const newPost = await PostServices.createPost({ title, content, author, category })
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
};
