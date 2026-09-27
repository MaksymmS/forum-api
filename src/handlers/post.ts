import type { Request, Response } from 'express';
import type { PostDTO } from '../dtos/dto.ts';
import * as PostService from '../services/post.js';

export async function getPosts(req: Request, res: Response): Promise<void> {
    try {
        const category = req.query.category as string | undefined;
        const take = req.query.take ? Number(req.query.take) : undefined;
        const posts = await PostService.getPosts(category, take); 
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

export async function getPostsById(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const post = await PostService.getPostById(id); 
        
        if (!post) {
            res.status(404).json({
                message: 'Post not found'
            });
            return;
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

export async function createPost(req: Request<{}, {}, PostDTO>, res: Response): Promise<void> {
    try {
        const { title, content, category } = req.body;

        if (!title || !content) {
            res.status(422).json({
                message: 'Title and content are required'
            });
            return; 
        }
        
        const newPost = await PostService.createPost({ title, content, category });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}