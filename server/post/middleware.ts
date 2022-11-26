import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from '../post/collection';

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

/**
 * Checks if a post with postId req.query.postId exists
 */
 const isPostQueryExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.query.postId as string);
  const post = validFormat ? await PostCollection.findOne(req.query.postId as string) : '';
  if (!post) {
    res.status(404).json({
      error: {
        postNotFound: `Post with post ID ${validFormat} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a post with postId req.body.postId exists
 */
 const isPostBodyExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.postId as string);
  const post = validFormat ? await PostCollection.findOne(req.body.postId as string) : '';
  if (!post) {
    res.status(404).json({
      error: {
        postNotFound: `Post with post ID ${req.body.postId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the title of the post in req.body is valid, i.e not a stream of empty
 * spaces and not more than 60 characters
 */
const isValidPostTitle = (req: Request, res: Response, next: NextFunction) => {
  const {title} = req.body as {title: string};
  if (!title.trim()) {
    res.status(400).json({
      error: 'Post title must be at least one character long.'
    });
    return;
  }

  if (title.length > 60) {
    res.status(413).json({
      error: 'Post title must be no more than 60 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the description of the post in req.body is valid, i.e not a stream of empty
 * spaces and not more than 200 characters
 */
 const isValidPostDescription = (req: Request, res: Response, next: NextFunction) => {
  const {description} = req.body as {description: string};
  if (!description.trim()) {
    res.status(400).json({
      error: 'Post description must be at least one character long.'
    });
    return;
  }

  if (description.length > 60) {
    res.status(413).json({
      error: 'Post description must be no more than 200 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the post has at least one file or image
 */
 const isValidPostImageOrFile = (req: Request, res: Response, next: NextFunction) => {
  const {files} = req.body as {files: string[]};
  const {images} = req.body as {images: string[]};

  console.log(files);
  console.log(images)

  if (files.length + images.length == 0) {
    res.status(400).json({
      error: 'Post must contain at least 1 image or file.'
    });
    return;
  }

  next();
};

export {
  isPostExists,
  isValidPostTitle,
  isValidPostDescription,
  isValidPostImageOrFile,
  isPostQueryExists,
  isPostBodyExists,
  // isValidPostModifier,
}

