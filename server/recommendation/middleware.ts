import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import PostCollection from '../post/collection';
import UserCollection from '../user/collection';
import RecommendationCollection from './collection';


const hasPreferences = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUserId(req.session.userId);
    if (user.preferences.length <= 0){
        res.status(405).json({
            error: `You have not specified any preferences.`
        });
        return;
    }
    next();
}

const isRecommendationExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.recommendationId);
    const recommendation = validFormat ? await RecommendationCollection.findOne(req.params.recommendationId) : '';
    if (!recommendation) {
      res.status(404).json({
          error: `Recommendation with recommendationID ${req.params.recommendationId} does not exist.`
      });
      return;
    }
    next();
}

const isValidModifier = async (req: Request, res: Response, next: NextFunction) => {
    const recomUser = await RecommendationCollection.findOne(req.params.recommendationId);
    if(recomUser._id !== req.session.userId){
        res.status(405).json({
            error: `You can not delete other user's recommendation.`
        });
        return;
    }
    next();
}

export{
    isRecommendationExists,
    isValidModifier,
    hasPreferences
}