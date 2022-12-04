import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Recommendation, PopulatedRecommendation} from './model';
import { Post } from 'server/post/model';

type RecommendationResponse = {
    _id: string;
    user:  string;
    recommendations: Post[];
    dateCreated: string;
}

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
 const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw recommendation object from the database into an object 
 * with all the information needed by frontend
 * 
 * @param {HydratedDocument<Recommendation>} recommendation - A recommendation
 * @returns {RecommendationResponse} - The post object formatted for the frontend
 */
 const constructRecommendationResponse = (recommendation: HydratedDocument<Recommendation>): RecommendationResponse => {
    const recommendationCopy: PopulatedRecommendation = {
      ...recommendation.toObject({
        versionKey: false
      })
    };
  
    const {username} = recommendationCopy.userId;
    delete recommendationCopy.userId;
  
    return {
      ...recommendationCopy,
      _id: recommendationCopy._id.toString(),
      user: username,
      dateCreated: formatDate(recommendation.dateCreated)
    };
  };
  
  export {
      constructRecommendationResponse,
      RecommendationResponse
  }; 