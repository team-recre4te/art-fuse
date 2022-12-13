import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

/**
 * This file contains a class with functionality to interact with likes stored
 * in MongoDB, including adding, finding, updating, and deleting.
 */
 class LikeCollection {
    /**
     * Add a new like
     *
     * @param {string} userId - The userId of the user to find
     * @param {string} postId - The postId of the post to add the like to
     * @return {Promise<HydratedDocument<Like>>} - The newly created like
     */
    static async addOne(userId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {  
      const like = new LikeModel({userId: userId, postId: postId});
      await like.save(); // Saves like to MongoDB
      return like.populate('userId');
    }
  
    /**
     * Delete a like from the collection
     *
     * @param {string} userId - The userId of user
     * @param {string} postId - The postId of the post to remove the like from for user with userId
     * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
     */
    static async deleteOne(userId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<boolean> {
      const like = await LikeModel.deleteOne({userId: userId, postId: postId});
      return like !== null;
    }

    /**
     * Find a like by postId.
     *
     * @param {string} postId - The postId of the post to find the like on
     * @return {Promise<HydratedDocument<Like>> | Promise<null>} - The like with the given postId, if any
     */
    static async findOne(userId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
        return LikeModel.findOne({userId: userId, postId: postId}).populate('userId');
    }

    /**
     * Find all likes for postId.
     *
     * @param {string} postId - The postId of the post to find the like on
     * @return {Promise<HydratedDocument<Like>> | Promise<null>} - The like with the given postId, if any
     */
    static async findAllByPostId(postId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
        return LikeModel.find({postId}).populate('userId');
    }

    /**
     * Delete all the likes by a given user
     *
     * @param {string} userId - The id of the user
     */
    static async deleteManyByUser(userId: Types.ObjectId | string): Promise<void> {
      await LikeModel.deleteMany({userId: userId});
    }

    /**
     * Delete all the likes for a given post
     *
     * @param {string} postId - The id of the post to remove all likes for
     */
    static async deleteMany(postId: Types.ObjectId | string): Promise<void> {
      await LikeModel.deleteMany({postId: postId});
    }
  }
  
  export default LikeCollection;