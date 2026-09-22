import * as PostRepository from '../repositories/post.js'

export const getPosts = async (category, take) => {
    return PostRepository.getAll(category, take);
};

export const getPostById = async (id) => {
    return PostRepository.getById(id);
};

export const createPost = async (postData) => {
    return PostRepository.addPost(postData);
};


