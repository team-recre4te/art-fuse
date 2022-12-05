import type {HydratedDocument} from 'mongoose';
import type {Category, PopulatedCategory} from '../category/model';
import type {Post} from '../post/model';

type CategoryResponse = {
  _id: string;
  name: string;
  postId: Post;
};

/**
 * Transform a raw Category object from the database into an object 
 * with all the information needed by frontend
 * 
 * @param {HydratedDocument<Category>} category - A category
 * @returns {CategoryResponse} - The category object formatted for the frontend
 */
const constructCategoryResponse = (category: HydratedDocument<Category>): CategoryResponse => {
  const categoryCopy: PopulatedCategory = {
    ...category.toObject({
      versionKey: false
    })
  };

  return {
    ...categoryCopy,
    _id: categoryCopy._id.toString(),
  };
};

export {
    constructCategoryResponse
};