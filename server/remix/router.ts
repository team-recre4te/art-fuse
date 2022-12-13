import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import RemixCollection from './collection';
import * as userValidator from '../user/middleware';
import * as postValidator from '../post/middleware';
import * as remixValidator from '../remix/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all remixes from a post.
 *
 * @name GET /api/remix?postId=postId
 *
 * @return {RemixResponse[]} - An array of tags associated with post by postId, postId
 * @throws {404} - If the post does not exist
 */
router.get('/',
  [
    postValidator.isPostQueryExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const postIdTags = await RemixCollection.findByParent(req.query.postId as string);
    const response = postIdTags.map(util.constructRemixResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all parent post of a remix
 *
 * @name GET /api/remix?postId=postId
 *
 * @return {RemixResponse[]} - An array of tags associated with post by postId, postId
 * @throws {404} - If the post does not exist
 */
router.get('/parent',
  [
    postValidator.isPostQueryExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const postIdTags = await RemixCollection.findByChild(req.query.postId as string);
    const response = postIdTags.map(util.constructRemixResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new remix.
 *
 * @name POST /api/remix
 *
 * @param {string} parentId - The id of the post being remixed
 * @param {string} postId - The id of the child post  
 * @return {TagResponse} - The created remix
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the child post does not exist
 * @throws {405} - If the parent post does not exist
 * @throws {405} - If the user is not the author of the new post
 */
router.post('/',
  [
    userValidator.isUserLoggedIn,
    postValidator.isPostBodyExists,
  remixValidator.isValidModifier
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const remix = await RemixCollection.addOne(req.body.parentId, req.body.postId);
    res.status(201).json({
      message: 'Your remix was created successfully.',
      post: util.constructRemixResponse(remix)
    });
  }
);

export { router as remixRouter };