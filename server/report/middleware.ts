import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from '../post/collection';
import UserCollection from '../user/collection';
import ReportCollection from './collection';

/**
 * Checks if a post is reported by the current user
 */
 const isReported = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.postId);
  const report = validFormat ? await ReportCollection.findOne(req.session.userId, req.params.postId) : '';
  if (!report) {
    res.status(403).json({
      error: `Report does not exist.`
    });
    return;
  }

  next();
};

/**
* Checks if a post is not reported by the current user
*/
const isNotReported = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.postId);
  const report = validFormat ? await ReportCollection.findOne(req.session.userId, req.body.postId) : '';
  console.log(report)
  if (report) {
    res.status(403).json({
      error: `Report already exists.`
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
  console.log(req.body.postId)
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

  /**
 * Checks if a postId in req.body is valid, that is, it matches the username regex
 */
//   const isAncestorOfPost = async (req: Request, res: Response, next: NextFunction) => {
//     console.log(req.params.postId)
//   const user = await UserCollection.findOneByUserId(req.session.userId);
//   const validFormat = Types.ObjectId.isValid(req.params.postId);
//   const ancestors = validFormat ? await PostCollection.findAllAncestors(req.params.postId) : '';
  
//   console.log(ancestors)
//   if (ancestors === '') {
//     res.status(404).json({
//       error: `Post with post ID ${req.body.postId} does not exist.`
//     });
//     return;
//   }

//   if(!ancestors.includes(user)) {
//     res.status(304).json({
//       error: 'You must be an ancestor of this post to report it.'
//     });
//     return;
//   }

//   next();
// };

export {
  isNotReported, 
  isReported,
  isValidPostId,
  isPostExists,
  // isAncestorOfPost
}

  