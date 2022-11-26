import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TagCollection from './collection';
import * as userValidator from '../user/middleware';
import * as postValidator from '../post/middleware';
import * as tagValidator from '../tag/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the tags
 *
 * @name GET /api/tags
 *
 * @return {PostResponse[]} - A list of all the tags
 */
/**
 * Get tags by post.
 *
 * @name GET /api/tags?postId=postId
 *
 * @return {TagResponse[]} - An array of tags associated with post by postId, postId
 *
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if postId query parameter was supplied
      if (req.query.postId !== undefined) {
        next();
        return;
      }

      const allTags = await TagCollection.findAll();
      const response = allTags.map(util.constructTagResponse);
      res.status(200).json(response);
    },
    [
      postValidator.isPostQueryExists
    ],
    async (req: Request, res: Response) => {
      const postIdTags = await TagCollection.findAllByPostId(req.query.postId as string);
      const response = postIdTags.map(util.constructTagResponse);
      res.status(200).json(response);
    }
  );

/**
 * Create a new tag.
 *
 * @name POST /api/tags
 *
 * @param {string} name - The name of the tag
 * @param {string} postId - The id of the post that has the tag
 * @return {TagResponse} - The created tag
 */
router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      postValidator.isPostBodyExists,
      tagValidator.isValidTagName
    ],
  async (req: Request, res: Response) => {
    
    const tag = await TagCollection.addOne(req.body.name, req.body.postId);
  
    res.status(201).json({
      message: 'Your tag was created successfully.',
      tag: util.constructTagResponse(tag)
    });
  }
);

/**
 * Delete a tag
 *
 * @name DELETE /api/tags/:id
 *
 * @return {string} - A success message
 */
router.delete(
  '/:tagId?',
  [
    userValidator.isUserLoggedIn,
    tagValidator.isTagExists,
    // tagValidator.isValidTagModifier
  ],
  async (req: Request, res: Response) => {
    await TagCollection.deleteOne(req.params.tagId);
    res.status(200).json({
      message: 'Your tag was deleted successfully.'
    });
  }
);

export {router as tagRouter};