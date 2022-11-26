import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';
import UserCollection from '../user/collection';
import type {User} from '../user/model';
import type {Post} from '../post/model';
import PostCollection from '../post/collection';
import PostModel from '../post/model';

/**
 * This files contains a class that has the functionality to explore likes
 * stored in MongoDB, including viewing, liking and unliking liked tweets.
 * Feel free to add additional operations in this file.
 */
class CommentCollection {
  /**
   * Add a comment to the collection
   *
   * @param {string} userId - The user who comments on the post
   * @param {Post} postId - The post
   * @param {string} content - content of the comment
   * @return {Promise<HydratedDocument<Comment>>} - The newly created comment
   */
  static async addOne(userId: Types.ObjectId | string, postId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Comment>> {
    // console.log(await PostCollection.findOne('6350918ff70365dc2a7dad40'))
    const date = new Date();

    const commentObj = await CommentCollection.findOne(postId);

    const comment = new CommentModel({
      userId,
      postId,
      content,
      dateCommented: date,
    });
    await comment.save(); // Saves like to MongoDB
    return comment.populate('userId');
  }
  
    /**
   * Get all the comments in the database
   *
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the posts
   */
     static async findAll(): Promise<Array<HydratedDocument<Comment>>> {
      // Retrieves posts and sorts them from most to least recent
      return CommentModel.find({}).sort({dateCreated: -1}).populate('userId');
    }

   /**
   * Find a comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } 
   */
    static async findOne(commentId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
      return CommentModel.findOne({_id: commentId}).populate('userId');
    }

  /**
   * Gets all comments on the post in database
   *
   * @param {PostId_} postId - The username of author of the posts
   * @return {Promise<HydratedDocument<Comments>[]>} - An array of all of the posts
   */
  static async findAllByPost(postIdToSearchFor: Types.ObjectId| string): Promise<Array<HydratedDocument<Comment>>> {
    return CommentModel.find({postId: postIdToSearchFor}).populate('userId');
    // return CommentModel.find({}).populate('userId');
  }

    /**
   * Get number of comments on a post
   *
   * @param {Post} postId - The post
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
     static async numComments(postIdToSearchFor: Types.ObjectId| string): Promise<Number> {
      const num = await CommentCollection.findAllByPost(postIdToSearchFor);
      return num.length;
    }
    
  /**
   * Remove a comment
   *
   * @param {string} commentId  - The comment to delete
   * @return {Promise<Boolean>} - true if the post has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const comment = await CommentModel.deleteOne({_id: commentId});
    return comment !== null;
  }
}

export default CommentCollection;
