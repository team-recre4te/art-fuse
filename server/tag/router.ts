import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TagCollection from './collection';
import PostCollection from '../post/collection';
import * as userValidator from '../user/middleware';
import * as postValidator from '../post/middleware';
import * as tagValidator from '../tag/middleware';
import * as util from './util';
import * as postUtil from '../post/util'

const router = express.Router();

/**
 * Get all posts by tag name
 *
 * @name GET /api/tags?name=name
 *
 * @return {PostResponse[]} - A list of all the posts that have the tag, tagName
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
    [
        tagValidator.isValidQueryTagName
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      const nameTags = await TagCollection.findAllByTagName(req.query.name as string);
      const posts = [];
      for (const tag of nameTags) {
        const post = await PostCollection.findOne(tag.postId);

        if (post) posts.push(post);
        
      }
      const response = posts.map(postUtil.constructPostResponse);
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
 * @param {string} names - The tag names to add
 * @param {string} postId - The id of the post to add tags to
 * @return {TagResponse} - The created tag
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    postValidator.isPostBodyExists,
    tagValidator.isValidTagNames
  ],
  async (req: Request, res: Response) => {
    const tags = await TagCollection.addMany(req.body.names, req.body.postId);
  
    res.status(201).json({
      message: 'Your tag was created successfully.',
      tags: tags.map(util.constructTagResponse)
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