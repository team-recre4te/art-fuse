import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import RecommendationCollection from './collection';
import * as userValidator from '../user/middleware';
import * as recommendationValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get recommendation for user.
 *
 * @name GET /api/recommendation
 *
 * @return {RecommendationResponse[]} - An array of recommendations for a user
 * @throws {403} - If user is not logged in
 * @throws {405} - If user has not selected any preferences 
 */
router.get('/',[
    userValidator.isUserLoggedIn,
    recommendationValidator.hasPreferences
],
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req.session.userId as string) ?? ''; 
        const recommendation = await RecommendationCollection.addOne(userId);
      
        res.status(201).json({
          message: 'Your post was created successfully.',
          recommendation: util.constructRecommendationResponse(recommendation)
        });

    });


/**
 * Delete a recommendation
 *
 * @name DELETE /api/recommendation/:id
 *
 * @return {string} - A success message
 */
 router.delete(
    '/:recommendationId?',
    [
      userValidator.isUserLoggedIn,
      recommendationValidator.isRecommendationExists,
      recommendationValidator.isValidModifier
    ],
    async (req: Request, res: Response) => {
      await RecommendationCollection.deleteOne(req.params.recommendationId);
      res.status(200).json({
        message: 'The recommendation was deleted successfully.'
      });
    }
  );
  
export {router as recommendationRouter};