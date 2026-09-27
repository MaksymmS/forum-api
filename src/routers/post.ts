import {Router} from 'express';
import * as PostHandler from '../handlers/post.js';

const router = Router();

router.get('/', PostHandler.getPosts);
router.get('/:id', PostHandler.getPostsById);
router.post('/', PostHandler.createPost);

export default router;


