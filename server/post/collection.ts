import type {HydratedDocument, Types} from 'mongoose';
import type {Post} from './model';
import type {User} from '../user/model';
import PostModel from './model';
import UserCollection from '../user/collection';
import CommentCollection from '../comment/collection';
import TagCollection from '../tag/collection';
import LikeCollection from '../like/collection';
import ReportCollection from '../report/collection';
import RemixCollection from '../remix/collection';
import CategoryModel from '../category/model';
import CommentModel from '../comment/model';
import TagModel from '../tag/model';
import LikeModel from '../like/model';
import ReportModel from '../report/model';
import RemixModel from '../remix/model';

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
    return (await post.populate(['authorId', 'tags'])).populate({
      path: 'likedBy',
      populate: {
        path: 'userId'
      }
    });
  }

  // helper function to fill in post details
  static async fillInPost(post: Post): Promise<Post> {
    post._id = post._id;
    
    const postRemixedFrom = await RemixCollection.findByChild(post._id);
    if (postRemixedFrom.length > 0) {
      // post is a remix
      post.parentId = (postRemixedFrom[0].parentId as unknown as Post);
    }
    post.category = await CategoryModel.findOne({postId: post._id});
    post.comments = await CommentCollection.findAllByPost(post._id);
    post.tags = await TagCollection.findAllByPostId(post._id);
    post.likes = await LikeCollection.findAllByPostId(post._id);
    post.reports = await ReportCollection.findAllByPostId(post._id);
    post.remixes = await RemixCollection.findByParent(post._id);

    // return post.populate(['comments', 'tags', 'likes', 'reports', 'remixes']);
    return post;
  }

  /**
   * Find a post using postId
   * 
   * @param {string} postId - The id of the post to find
   * @return {Promise<HydratedDocument<Post>> | Promise<null> } - The post with the given postId, if any
   */
  static async findOne(postId: Types.ObjectId | string): Promise<HydratedDocument<Post>> {
    var post = await PostModel.findOne({_id: postId}).populate('authorId');

    if (post) {
      // return (await post.populate(['authorId', 'tags'])).populate({
      //   path: 'likedBy',
      //   populate: {
      //     path: 'userId'
      //   }
      // }); 

      await this.fillInPost(post);
      return post;
    } else {
      return post;
    }
  }

  /**
   * Get all the posts in the database
   * 
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  static async findAll(): Promise<Post[]> {
    // return PostModel.find({}).sort({dateModified: -1}).populate(['authorId', 'parentId', 'tags']).populate({
    //   path: 'likedBy',
    //   populate: {
    //     path: 'userId'
    //   }
    // });
    const posts = await PostModel.find({ }).sort({dateModified: -1}).populate('authorId');
    var filledInPosts = [];
    for (const post of posts) {
      const filledInPost = await this.fillInPost(post);
      filledInPosts.push(filledInPost);
    }
    return filledInPosts;
  }

  /**
   * Get all posts by given author
   *
   * @param {string} username - The username of author of the posts
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
   static async findAllByUsername(username: string): Promise<Post[]> {
    const author = await UserCollection.findOneByUsername(username);
    if (!author) return [];
    const authorPosts = await PostModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
    var filledInPosts = [];
    for (const post of authorPosts) {
      const filledInPost = await this.fillInPost(post);
      filledInPosts.push(filledInPost);
    }
    return filledInPosts;
  }


  /**
   * Get all posts with given tag name
   *
   * @param {string} name - The tag name being searched for
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
   static async findAllWithTag(name: string): Promise<Post[]> {
    const allPosts = await this.findAll();
    return allPosts.filter(post => { 
      const postTags = post.tags.map(tag => { return tag.name.toLowerCase() });
      return postTags.includes(name);
    });
  }

    /**
   * Get all posts with given Category name
   *
   * @param {string} name - The tag name being searched for
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
    static async findAllWithCategory(name: string): Promise<Post[]> {
      const allPosts = await this.findAll();
      return allPosts.filter(post => { 
        const postCategory = post.category.name.toLowerCase();
        return postCategory === name;
      });
    }

  /**
   * Get all remixes of given post
   * 
   * @param {Types.ObjectId | string} parentId - The id of the parent post
   * @return {Promise<HydratedDocument<Post>[]>} - An array of all of the posts
   */
  // static async findAllByParent(parentId: Types.ObjectId | string): Promise<Array<HydratedDocument<Post>>> {
  //   return PostModel.find({parentId}).sort({dateModified: -1}).populate(['authorId', 'parentId', 'tags']).populate({
  //     path: 'likedBy',
  //     populate: {
  //       path: 'userId'
  //     }
  //   });
  // }

    /**
   * Get all ancestors of given post
   *
   * @param {string} postId - The post
   * @return {Promise<HydratedDocument<User>[]>} - An array of all of the ancestors of the post
   */
  // static async findAllAncestors(postId:  Types.ObjectId | string): Promise<Array<HydratedDocument<User>>> {
  //   let post = await PostCollection.findOne(postId);
  //   let parent
  //   let parents = []
  //   while(post.parentId !== null){
  //     post = await PostCollection.findOne(post.parentId);
  //     parent = await UserCollection.findOneByUserId(post.authorId);
  //     parents.push(parent);
  //   }
  //   return parents
  // }

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
    return (await post.populate(['authorId', 'parentId', 'tags'])).populate({
      path: 'likedBy',
      populate: {
        path: 'userId'
      }
    });
  }

  /**
   * Delete a post with given postId.
   *
   * @param {string} postId - The postId of post to delete
   * @return {Promise<Boolean>} - true if the post has been deleted, false otherwise
   */
   static async deleteOne(postId: Types.ObjectId | string): Promise<boolean> {
    const post = await PostModel.deleteOne({_id: postId});
    const category = await CategoryModel.deleteOne({postId: postId});
    const comments = await CommentModel.deleteMany({postId: postId});
    const tags = await TagModel.deleteMany({postId: postId});
    const likes = await LikeModel.deleteMany({postId: postId});
    const reports = await ReportModel.deleteMany({postId: postId});
    const remixes = await RemixModel.deleteMany({childId: postId});
    return (post && category && comments && tags && likes && reports) !== null;
  }

  /**
   * Delete all the posts by the given author
   *
   * @param {string} authorId - The id of author of posts
   */
   static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    // await PostModel.deleteMany({authorId});
    const posts = await PostModel.find({authorId: authorId});
    for (const post of posts){
      await this.deleteOne(post._id);
    }
    return;
  }

}

export default PostCollection;