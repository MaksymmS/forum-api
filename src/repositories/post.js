let posts = [
    {id: 1, title: 'Mackbook', content: 'laptop', author: 'Apple', category: 'Electronics'},
    {id: 2, title: 'Iphone', content: 'phone', author: 'Apple', category: 'Electronics'},
    {id: 3, title: 'Samsung', content: 'phone', author: 'Samsung', category: 'Electronics'},
];

export const getAll = async (category, take) => {
    let result = [...posts];
    
    if (category) {
        result = result.filter(post => post.category === category)
    }
    
    if (take) {
        result = result.slice(0, Number(take))
    }
    
    return result;
}

export const getById = async (id) => {
    return posts.find(post => post.id === Number(id));
};

export const addPost = (postData) => {
    return new Promise((resolve) => {
        const newPost = {
            id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
            ...postData
        };
        posts.push(newPost);
        resolve(newPost);
    });
};