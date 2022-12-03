import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from '../post/collection';

const isValidModifier = async (req: Request, res: Response, next: NextFunction) => {
    const post = await PostCollection.findOne(req.body.postId);
    const userId = post.authorId._id;
    if (req.session.userId !== userId.toString()) {
      res.status(405).json({
        error: 'Cannot remix other users\' posts.'
      });
      return;
    }
  
    next();
}

export {
    isValidModifier
}