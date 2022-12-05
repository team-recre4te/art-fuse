import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CategoryCollection from '../category/collection';

/**
 * Checks if the name of the category in req.body is valid, i.e not a stream of empty
 * spaces and not more than 30 characters
 */
 const isValidCategoryName = (req: Request, res: Response, next: NextFunction) => {
    const {name} = req.body as {name: string};
    console.log(name);
    if (!name.trim()) {
      res.status(400).json({
        error: 'Category name must be at least one character long.'
      });
      return;
    }
  
    if (name.length > 30) {
      res.status(413).json({
        error: 'Category title must be no more than 30 characters.'
      });
      return;
    }
  
    next();
};

const isValidQueryCategoryName = (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.query as {name: string};
  console.log(name);
  if (!name.trim()) {
    res.status(400).json({
      error: 'Category name must be at least one character long.'
    });
    return;
  }

  if (name.length > 30) {
    res.status(413).json({
      error: 'Category title must be no more than 30 characters.'
    });
    return;
  }

  next();
};

const isCategoryExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.categoryId);
    const category = validFormat ? await CategoryCollection.findOne(req.params.categoryId) : '';
    if (!category) {
      res.status(404).json({
          error: `Category with category ID ${req.params.categoryId} does not exist.`
      });
      return;
    }
    next();
  }

export {
  isValidCategoryName, 
  isCategoryExists,
  isValidQueryCategoryName,
}

  