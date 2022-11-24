import type {HydratedDocument, Types} from 'mongoose';
import type {Post} from './model';
import PostModel from './model';
import UserCollection from '../user/collection';

class PostCollection {
  /**
   * Add a post to the collection
   * 
   * @param {string} authorId - The id of the author of the post
   * @param {string} title - The title of the post
   * @param {string} description - The description of the post
   * @param {string[]} images - The list of images for the post
   * @param {string[]} files - The list of files for the post
   * not sure if we're including parent or reportStatus
   */
  static async addOne(authorId: Types.ObjectId | string, title: string, description: string,  files: string[], images: string[]): Promise<HydratedDocument<Post>> {
    const date = new Date();

    const post = new PostModel({
        authorId,
        title,
        description,
        files,
        images,
        dateCreated: date,
        dateModified: date,
    });
    await post.save();
    return post.populate('authorId');
  }

  /**
   * Find a post using postId
   * 
   * @param {string} postId - The id of the post to find
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } - The post with the given postId, if any
   */
  static async findOne(postId: Types.ObjectId | string): Promise<HydratedDocument<Post>> {
    return (await PostModel.findOne({_id: postId})).populate(['authorId']);
  }

  /**
   * Get all the posts in the database
   * 
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAll(): Promise<Array<HydratedDocument<Post>>> {
    return PostModel.find({}).sort({dateModified: -1}).populate(['authorId', 'parentId']);
  }

  /**
   * Get all posts by given author
   *
   * @param {string} username - The username of author of the posts
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
   static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Post>>> {
    const author = await UserCollection.findOneByUsername(username);
    return PostModel.find({authorId: author._id}).sort({dateModified: -1}).populate(['authorId', 'parentId']);
  }

  /**
   * Get all remixes of given post
   * 
   * @param {Types.ObjectId | string} parentId - The id of the parent post
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAllByParent(parentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Post>>> {
    return PostModel.find({parentId}).sort({dateModified: -1}).populate(['authorId', 'parentId']);
  }

  /**
   * Update a post
   *
   * @param {string} postId - The id of the post to be updated
   * @param {string} title - The new title of the post
   * @param {string} description - The new description of the post
   * @return {Promise<HydratedDocument<Post>>} - The newly updated post
   */
   static async updateOne(postId: Types.ObjectId | string, title: string, description: string, files: string[], images: string[]): Promise<HydratedDocument<Post>> {
    const post = await PostModel.findOne({_id: postId});
    post.title = title;
    post.description = description;
    post.files = files;
    post.images = images;
    post.dateModified = new Date();
    await post.save();
    return post.populate(['authorId', 'parentId']);
  }

  /**
   * Delete a post with given postId.
   *
   * @param {string} postId - The postId of post to delete
   * @return {Promise<Boolean>} - true if the post has been deleted, false otherwise
   */
   static async deleteOne(postId: Types.ObjectId | string): Promise<boolean> {
    const post = await PostModel.deleteOne({_id: postId});
    return post !== null;
  }

  /**
   * Delete all the posts by the given author
   *
   * @param {string} authorId - The id of author of posts
   */
   static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await PostModel.deleteMany({authorId});
  }

}

export default PostCollection;