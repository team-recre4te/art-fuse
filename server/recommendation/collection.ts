import type {HydratedDocument, Types} from 'mongoose';
import type {Recommendation as Recommendation} from './model';
import RecommendationModel from './model';
import UserCollection from '../user/collection';
import PostCollection from '../post/collection';

class RecommendationCollection {
    /**
     * Find a recommendation using recommendationId
     * 
     * @param {string} recommendationId - The id of the recommendation to find
     * @return {Promise<HydratedDocument<Recommendation>> | Promise<null> } - The recommendation with the given recommendationId, if any
     */
    static async findOne(recommendationId: Types.ObjectId | string): Promise<HydratedDocument<Recommendation>> {
        return (await RecommendationModel.findOne({_id: recommendationId}));
    }


    /**
     * add a recommendation
     * @param userId the user requesting a recommendation
     * @returns {Promise<HydratedDocument<Recommendation>>} a recommendation with recommendations of projects to work on
     */
    static async addOne(userId:Types.ObjectId|string):Promise<HydratedDocument<Recommendation>>{
        const date = new Date();
        const user = await UserCollection.findOneByUserId(userId);
        const recommendations:string[] = []
        for (const pref of user.preferences){
            //find the most liked post with the current preference
            const posts = await PostCollection.findAllWithCategory(pref);
            const mostLiked = posts.reduce((prev, current) => {
                return (prev.likedBy.length > current.likedBy.length) ? prev : current
            });
            //add the post
            if (mostLiked!== undefined){
                const id = mostLiked?._id.toString()
                if (!recommendations.includes(id)) recommendations.push(id);
            };
        }
        const recommendation = new RecommendationModel({
            userId,recommendations,date
        })
        await recommendation.save();
        return recommendation.populate(['userId','recommendations']);
    }
    /**
     * find all recommendation made for a user
     * @param userId the user requesting a recommendation
     * @returns {Promise<HydratedDocument<Recommendation>>[]} array of recommendation
     */
    static async findForUser(userId:Types.ObjectId|string):Promise<HydratedDocument<Recommendation>[]>{
        return RecommendationModel.find({userId: userId}).sort({dateCreated: -1}).populate(['userId','recommendations'])
    }

    /**
     * 
     * @param recommendationId 
     * @returns 
     */
    static async deleteOne(recommendationId:Types.ObjectId|string):Promise<boolean>{
        const notif = await RecommendationModel.deleteOne({_id: recommendationId});
        return notif !== null;
    }

    /**
     * 
     * @param userId 
     * @returns
     */
    static async deleteAllByUser(userId:Types.ObjectId|string):Promise<void>{
        await RecommendationModel.deleteMany({userId});
    }
}

export default RecommendationCollection;