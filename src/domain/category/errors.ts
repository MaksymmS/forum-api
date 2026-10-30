export class CategoryAlreadyExistsError extends Error {
  constructor() {
    super('Category with this name already exists');
    this.name = 'CategoryAlreadyExistsError';
  }
}

export class CategoryNotFoundError extends Error {
  constructor() {
    super('Category not found');
    this.name = 'CategoryNotFoundError';
  }
}
