import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CategoryCollection from './collection';
import PostCollection from '../post/collection';
import * as userValidator from '../user/middleware';
import * as postValidator from '../post/middleware';
import * as categoryValidator from '../category/middleware';
import * as util from './util';
import * as postUtil from '../post/util';
const router = express.Router();

/**
/**
 * Get all posts by category name
 *
 * @name GET /api/categories?name=name
 *
 * @return {PostResponse[]} - A list of all the posts that have the category, name
 */
/**
 * Get categories by post.
 *
 * @name GET /api/categories?postId=postId
 *
 * @return {CategoryResponse[]} - An array of categories associated with post by postId, postId
 *
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.query.name) next(); // skip to the next middleware in this substack
      else if (req.query.postId) next('route'); // skip the rest of this substack, move to next substack
      else return;
    },
    [
        categoryValidator.isValidQueryCategoryName
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const nameTags = await CategoryCollection.findAllByCategoryName(req.query.name as string);
        const posts = [];
        for (const tag of nameTags) {
          const post = await PostCollection.findOne(tag.postId);
  
          if (post) posts.push(post);
          
        }
        const response = posts.map(postUtil.constructPostResponse);
        res.status(200).json(response);
      },
  );
  router.get(
    '/',
    [
      postValidator.isPostQueryExists
    ],
    async (req: Request, res: Response) => {
      const postIdCategories = await CategoryCollection.findAllByPostId(req.query.postId as string);
      const response = postIdCategories.map(util.constructCategoryResponse);
      res.status(200).json(response);
    },
  )

/**
 * Create a new category.
 *
 * @name POST /api/categories
 *
 * @param {string} name - The name of the category
 * @param {string} postId - The id of the post that has the category
 * @return {CategoryResponse} - The created category
 */
router.post(
    '/',
    [
      // userValidator.isUserLoggedIn,
      // postValidator.isPostBodyExists,
      // categoryValidator.isValidCategoryName
    ],
  async (req: Request, res: Response) => {
    
    const category = await CategoryCollection.addOne(req.body.name, req.body.postId);
  
    res.status(201).json({
      message: 'Your cateogry was created successfully.',
      category: util.constructCategoryResponse(category)
    });
  }
);

/**
 * Delete a category
 *
 * @name DELETE /api/categories/:id
 *
 * @return {string} - A success message
 */
router.delete(
  '/:categoryId?',
  [
    userValidator.isUserLoggedIn,
    categoryValidator.isCategoryExists,
    // categoryValidator.isValidCategoryModifier
  ],
  async (req: Request, res: Response) => {
    await CategoryCollection.deleteOne(req.params.categoryId);
    res.status(200).json({
      message: 'Your category was deleted successfully.'
    });
  }
);

export {router as categoryRouter};