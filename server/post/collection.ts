import type {HydratedDocument, Types} from 'mongoose';
import type {Post} from './model';
import PostModel from './model';
import FreetModel from './model';
// import UserCollection from '../user/collection';

class PostCollection {
  /**
   * Add a post to the collection
   * 
   * @param {string} authorId - The id of the author of the post
   * @param {string} title - The title of the post
   * @param {string} description - The description of the post
   * not sure how to write out categories, tags, files, or images yet
   * not sure if we're including parent or reportStatus
   */
  static async addOne(authorId: Types.ObjectId | string, title: string, description: string): Promise<HydratedDocument<Post>> {
    const date = new Date();
    const post = new PostModel({
        authorId,
        title,
        description,
        // missing categories, tags, files, images, parent, and reportStatus
        dateCreated: date,
    });
    await post.save();
    return post.populate('authorId');
  }

  /**
   * 
   */
  static async findOne(postId: Types.ObjectId | string): Promise<HydratedDocument<Post>> {
    return (await PostModel.findOne({_id: postId})).populated('authorId');
  }
}

export default PostCollection;