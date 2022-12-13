import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentModel from './model';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as postValidator from '../post/middleware';
import * as commentValidator from '../comment/middleware';
import * as util from './util';

const router = express.Router();

/*
 * Get comments on post/ comment.
 *
 * @name GET /api/comment?postId=id
 *
 * @return {CommentResponse[]} - An array of comments on  post with id, postId
 * @throws {400} - If postId is not given
 * @throws {404} - If no post has given postId
 *
 */

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.postId !== undefined) {
      next();
      return;
    }
    const allComments = await CommentCollection.findAll();
    const response = await Promise.all(allComments.map(util.constructCommentResponse));
    res.status(200).json(response);
  },
  [
    // postValidator.isPostExists,
    commentValidator.isPostExists,
  ],
  async (req: Request, res: Response) => {
    const comments = await CommentCollection.findAllByPost(req.query.postId as string);
    const response = await Promise.all(comments.map(util.constructCommentResponse));
    res.status(200).json(response);
  }
);

/**
 * Create a new comment.
 *
 * @name POST /api/comments
 *
 * @param {string} content - The content of the comment
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the post content is empty or a stream of empty spaces
 * @throws {413} - If the post content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    // commentValidator.isPostExists,

  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const postId = (req.body.postId as string) ?? ''; 
    
    const comment = await CommentCollection.addOne(userId, postId, req.body.content);

    res.status(201).json({
      message: 'Your comment was created successfully.',
      comment: await util.constructCommentResponse(comment)
    });
  }
);

/**
 * Delete a comment
 *
 * @name DELETE /api/comments/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the post
 * @throws {404} - If the postId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentModifier
  ],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);
export {router as commentRouter};
