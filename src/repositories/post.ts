import type { PostDTO, PostResponseDTO } from '../dtos/dto.js';

const posts: PostResponseDTO[] = [
    { id: '1', title: 'Mackbook', content: 'laptop', category: 'Electronics' },
    { id: '2', title: 'Iphone', content: 'phone', category: 'Electronics' },
    { id: '3', title: 'Samsung', content: 'phone', category: 'Electronics' },
];

export async function getAll(category?: string, take?: number): Promise<PostResponseDTO[]> {
    let result = [...posts];
    
    if (category) {
        result = result.filter(post => post.category === category);
    }
    
    if (take) {
        result = result.slice(0, Number(take));
    }
    
    return result;
}


export async function getById(id: string): Promise<PostResponseDTO | undefined> {
    return posts.find(post => post.id === (id));
};

export async function addPost(postData: PostDTO): Promise<PostResponseDTO> {
    const nextId = posts.length > 0 ? Math.max(...posts.map(p => Number(p.id))) + 1 : 1
    const newPost: PostResponseDTO = {
        id: String(nextId), 
        ...postData
    };
    posts.push(newPost);
    return newPost;
};