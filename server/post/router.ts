import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import PostCollection from './collection';
import * as userValidator from '../user/middleware';
import * as postValidator from '../post/middleware';
import * as tagValidator from '../tag/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the posts
 *
 * @name GET /api/posts
 *
 * @return {PostResponse[]} - A list of all the posts sorted in descending
 *                      order by date modified
 */
/**
 * Get posts by author.
 *
 * @name GET /api/posts?author=username
 *
 * @return {PostResponse[]} - An array of posts created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if authorId query parameter was supplied
      if (req.query.author !== undefined || req.query.postId !== undefined) {
        next();
        return;
      }

      const allPosts = await PostCollection.findAll();
      const response = allPosts.map(util.constructPostResponse);
      res.status(200).json(response);
    },
    [
      postValidator.isPostQueryExists
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if authorId query parameter was supplied
      if (req.query.author !== undefined) {
        next();
        return;
      }

      const post = await PostCollection.findOne(req.query.postId as string);
      res.status(200).json(util.constructPostResponse(post));
    // res.status(200).json({
    //     message: 'Your post was updated successfully.',
    //     post: util.constructPostResponse(post)
    //   });

      return;
    },
    [
      userValidator.isAuthorExists
    ],
    async (req: Request, res: Response) => {
      const authorPosts = await PostCollection.findAllByUsername(req.query.author as string);
      const response = authorPosts.map(util.constructPostResponse);
      res.status(200).json(response);

      return;
    }
  );

/**
 * Get all posts with tag
 *
 * @name GET /api/posts/tags?name=tag
 *
 * @return {PostResponse[]} - An array of posts with tag, name
 * @throws {400} - If name is not given
 *
 */
 router.get(
  '/tags',
  [
    tagValidator.isValidQueryTagName
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const postsWithTag = await PostCollection.findAllWithTag(req.query.name as string);
    const response = postsWithTag.map(util.constructPostResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new post.
 *
 * @name POST /api/posts
 *
 * @param {string} title - The title of the post
 * @param {string} description - The description for the post
 * @param {string[]} files - The files for the post
 * @param {string[]} images - The images for the post
 * @param {string?} parentId - The id of the parent post
 * @return {PostResponse} - The created post
 */
router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      postValidator.isValidPostTitle,
      postValidator.isValidPostDescription,
      postValidator.isValidPostImageOrFile
    ],
  async (req: Request, res: Response) => {
    
    const authorId = (req.session.userId as string) ?? '';

    const parentId = req.body.parentId ?? undefined; 
    const post = await PostCollection.addOne(authorId, req.body.title, req.body.description, req.body.files, req.body.images);
  
    res.status(201).json({
      message: 'Your post was created successfully.',
      post: util.constructPostResponse(post)
    });
  }
);

/**
 * Delete a post
 *
 * @name DELETE /api/posts/:id
 *
 * @return {string} - A success message
 */
router.delete(
  '/:postId?',
  [
    userValidator.isUserLoggedIn,
    postValidator.isPostExists,
    // postValidator.isValidPostModifier
  ],
  async (req: Request, res: Response) => {
    await PostCollection.deleteOne(req.params.postId);
    res.status(200).json({
      message: 'Your post was deleted successfully.'
    });
  }
);

/**
 * Modify a post
 *
 * @name PATCH /api/posts/:id
 *
 * @param {string} title - the new title for the post
 * @param {string} description - the new description for the post
 * @param {string[]} files - The new files for the post
 * @param {string[]} images - The new images for the post
 * @return {PostResponse} - the updated post
 */
router.patch(
  '/:postId?',
  [
    userValidator.isUserLoggedIn,
    postValidator.isPostExists,
    postValidator.isValidPostTitle,
    postValidator.isValidPostDescription,
  ],
  async (req: Request, res: Response) => {
    const post = await PostCollection.updateOne(req.params.postId, req.body.title, req.body.description, req.body.files, req.body.images);
    res.status(200).json({
        message: 'Your post was updated successfully.',
        post: util.constructPostResponse(post)
      });
    }
  );

export {router as postRouter};