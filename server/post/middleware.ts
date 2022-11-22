import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from '../post/collection';
import FreetCollection from '../post/collection';

const isPostExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.postId);
  const post = validFormat ? await PostCollection.findOne(req.params.postId) : '';
  if (!post) {
    res.status(404).json({
        error: `Post with post ID ${req.params.postId} does not exist.`
    });
    return;
  }
  next();
}

export {
  isPostExists,
}