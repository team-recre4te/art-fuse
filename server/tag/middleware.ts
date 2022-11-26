import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import TagCollection from '../tag/collection';

/**
 * Checks if the name of the tag in req.body is valid, i.e not a stream of empty
 * spaces and not more than 30 characters
 */
 const isValidTagName = (req: Request, res: Response, next: NextFunction) => {
    const {name} = req.body as {name: string};
    if (!name.trim()) {
      res.status(400).json({
        error: 'Tag name must be at least one character long.'
      });
      return;
    }
  
    if (name.length > 30) {
      res.status(413).json({
        error: 'Tag title must be no more than 30 characters.'
      });
      return;
    }
  
    next();
};

/**
 * Checks if the name of the tag in req.body is valid, i.e not a stream of empty
 * spaces and not more than 30 characters
 */
 const isValidQueryTagName = (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.query as {name: string};
  if (!name.trim()) {
    res.status(400).json({
      error: 'Tag name must be at least one character long.'
    });
    return;
  }

  if (name.length > 30) {
    res.status(413).json({
      error: 'Tag title must be no more than 30 characters.'
    });
    return;
  }

  next();
};

const isTagExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.tagId);
    const tag = validFormat ? await TagCollection.findOne(req.params.tagId) : '';
    if (!tag) {
      res.status(404).json({
          error: `Tag with tag ID ${req.params.tagId} does not exist.`
      });
      return;
    }
    next();
  }

export {
  isValidTagName, 
  isTagExists,
  isValidQueryTagName
}

  