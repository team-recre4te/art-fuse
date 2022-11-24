import type {HydratedDocument, Types} from 'mongoose';
import type {Tag} from './model';
import TagModel from './model';

class TagCollection {
  /**
   * Add a post to the collection
   * 
   * @param {string} authorId - The id of the author of the post
   * @param {string} title - The title of the post
   * @param {string} description - The description of the post
   * @param {string[]} images - The list of images for the post
   * @param {string[]} files - The list of files for the post
   */
  static async addOne(name: string, postId: Types.ObjectId | string): Promise<HydratedDocument<Tag>> {

    const tag = new TagModel({
        name,
        postId,
    });
    await tag.save();
    return tag.populate('postId');
  }

  /**
   * Find a tag using tagId
   * 
   * @param {string} tagId - The id of the tag to find
   * @return {Promise<HydratedDocument<Tag>> | Promise<null> } - The tag with the given tagId, if any
   */
  static async findOne(tagId: Types.ObjectId | string): Promise<HydratedDocument<Tag>> {
    return (await TagModel.findOne({_id: tagId})).populate('postId');
  }

  /**
   * Get all the tags in the database
   * 
   * @return {Promise<HydratedDocument<Tag>[]>} - An array of all of the tags
   */
  static async findAll(): Promise<Array<HydratedDocument<Tag>>> {
    return TagModel.find({}).sort({dateModified: -1}).populate('postId');
  }

  /**
   * Get all tags by given postId
   *
   * @param {string} postId - The postId of post that tags are being searched for
   * @return {Promise<HydratedDocument<Tag>[]>} - An array of all of the posts
   */
   static async findAllByPostId(postId: string): Promise<Array<HydratedDocument<Tag>>> {
    return TagModel.find({postId}).sort({dateModified: -1}).populate('postId');
  }

  /**
   * Delete a tag with given tagId.
   *
   * @param {string} tagId - The tagId of tag to delete
   * @return {Promise<Boolean>} - true if the tag has been deleted, false otherwise
   */
   static async deleteOne(tagId: Types.ObjectId | string): Promise<boolean> {
    const tag = await TagModel.deleteOne({_id: tagId});
    return tag !== null;
  }

  /**
   * Delete all the tags by the given post
   *
   * @param {string} postId - The id of the post with the tags
   */
   static async deleteMany(postId: Types.ObjectId | string): Promise<void> {
    await TagModel.deleteMany({postId});
  }

}

export default TagCollection;