import type {HydratedDocument, Types} from 'mongoose';
import type {Category} from './model';
import CategoryModel from './model';

class CategoryCollection {
  /**
   * Add a category to the collection
   * 
   * @param {string} name - The name of the category
   * @param {Types.ObjectId | string} postId - The id of the post that has the category
   */
  static async addOne(name: string, postId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {

    const category = new CategoryModel({
        name,
        postId,
    });
    await category.save();
    return category.populate('postId');
  }

  /**
   * Find a category using categoryId
   * 
   * @param {string} categoryId - The id of the category to find
   * @return {Promise<HydratedDocument<Category>> | Promise<null> } - The category with the given categoryId, if any
   */
  static async findOne(categoryId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
    return (await CategoryModel.findOne({_id: categoryId})).populate('postId');
  }

  /**
   * Get all the categories in the database
   * 
   * @return {Promise<HydratedDocument<Category>[]>} - An array of all of the categories
   */
  static async findAll(): Promise<Array<HydratedDocument<Category>>> {
    return CategoryModel.find({}).populate('postId');
  }

  /**
   * Get all categories by given postId
   *
   * @param {string} postId - The postId of post that categories are being searched for
   * @return {Promise<HydratedDocument<Category>[]>} - An array of all of the posts
   */
   static async findAllByPostId(postId: string): Promise<Array<HydratedDocument<Category>>> {
    return CategoryModel.find({postId}).populate('postId');
  }

  /**
   * Get all categories by given tag name
   *
   * @param {string} name - The name of the category
   * @return {Promise<HydratedDocument<Category>[]>} - An array of all of the tags
   */
  static async findAllByCategoryName(name: string): Promise<Array<HydratedDocument<Category>>> {
    return CategoryModel.find({name}).populate('postId');
  }

  /**
   * Delete a category with given categoryId.
   *
   * @param {string} categoryId - The categoryId of category to delete
   * @return {Promise<Boolean>} - true if the category has been deleted, false otherwise
   */
   static async deleteOne(categoryId: Types.ObjectId | string): Promise<boolean> {
    const category = await CategoryModel.deleteOne({_id: categoryId});
    return category !== null;
  }

  /**
   * Delete all the categories by the given post
   *
   * @param {string} postId - The id of the post with the categories
   */
   static async deleteMany(postId: Types.ObjectId | string): Promise<void> {
    await CategoryModel.deleteMany({postId});
  }

}

export default CategoryCollection;