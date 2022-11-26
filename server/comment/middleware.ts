import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from '../post/collection';
import CommentCollection from '../comment/collection';

const isCommentExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.commentId);
  const comment = validFormat ? await CommentCollection.findOne(req.params.commentId) : '';
  if (!comment) {
    res.status(404).json({
      error: {
        commentNotFound: `Comment with comment ID ${req.params.commentId} does not exist.`
      }
    });
    return;
  }

  next();
};

const isPostExists = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.postId as string;
  const validFormat = Types.ObjectId.isValid(id);
  let post;
  if (validFormat){
    post = await PostCollection.findOne(id);
  }
  if (!post) {
    res.status(404).json({
      error: {
        postNotFound: `Reference post with ID ${id} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the post whose commentId is in req.params
 */
 const isValidCommentModifier = async (req: Request, res: Response, next: NextFunction) => {
  const comment = await CommentCollection.findOne(req.params.commentId);
  const userId = comment.userId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' comments.'
    });
    return;
  }

  next();
};


export {
  isCommentExists,
  isPostExists,
  isValidCommentModifier
};
