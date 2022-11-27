import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from './collection';
import PostCollection from '../post/collection';

/**
 * Checks if a post is liked by the current user
 */
const isLiked = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.postId);
    const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.params.postId) : '';
    if (!like) {
      res.status(403).json({
        error: `Like does not exist.`
      });
      return;
    }
  
    next();
};

/**
 * Checks if a post is not liked by the current user
 */
const isNotLiked = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.postId);
    const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.body.postId) : '';
    if (like) {
      res.status(403).json({
        error: `Like already exists.`
      });
      return;
    }
  
    next();
};

/**
 * Checks if a postId in req.body is valid, that is, it matches the username regex
 */
 const isValidPostId = (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.postId);
  if (!validFormat) {
    res.status(400).json({
      error: 'PostId must be of type objectId.'
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with postId is req.params exists
 */
 const isPostExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.postId);
    const post = validFormat ? await PostCollection.findOne(req.body.postId) : '';
    if (!post) {
      res.status(404).json({
        error: `Post with post ID ${req.body.postId} does not exist.`
      });
      return;
    }
  
    next();
  };

export {
  isLiked,
  isNotLiked,
  isValidPostId,
  isPostExists
};