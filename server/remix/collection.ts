import type {HydratedDocument, Types} from 'mongoose';
import type {Remix} from './model';
import RemixModel from './model';

class RemixCollection {
    
    /**
     * 
     * @param parentId 
     * @param childId 
     * @returns 
     */
    static async addOne(parentId:Types.ObjectId | string, childId:Types.ObjectId | string){
        const remix = new RemixModel({
            parentId,
            childId,
        });
        await remix.save();
        return (await (await remix.populate(['parentId','childId'])).populate({
            path: 'childId',
            populate: {
              path: 'authorId'
            }
        }));
    }

    /**
     * 
     * @param remixId 
     * @returns 
     */
    static async findOne(remixId:Types.ObjectId | string):Promise<HydratedDocument<Remix>> {
        return (await (await RemixModel.findOne({_id: remixId})).populate(['parentId','childId'])).populate({
            path: 'childId',
            populate: {
              path: 'authorId'
            }
        });
    }

    /**
     * 
     * @param parentId 
     * @returns 
     */
    static async findByParent(parentId:Types.ObjectId | string): Promise<Array<HydratedDocument<Remix>>>{
        return RemixModel.find({ parentId: parentId}).populate(['parentId','childId']).populate({
            path: 'childId',
            populate: {
              path: 'authorId'
            }
        });
    }

    /**
     * 
     * @param childId 
     * @returns 
     */
    static async findByChild(childId:Types.ObjectId | string):Promise<Array<HydratedDocument<Remix>>>{
        return RemixModel.find({childId: childId}).populate(['parentId','childId']).populate({
            path: 'childId',
            populate: {
              path: 'authorId'
            }
        }).populate({
            path: 'parentId',
            populate: {
              path: 'authorId'
            }
        });
    }

    static async deleteOne(remixId:Types.ObjectId | string): Promise<boolean> {
        const remix = await RemixModel.deleteOne({_id: remixId});
        return remix !== null;
    }

    /**
     * Delete all the posts made by the user.
     *  
     * @param userId - The userId of user requesting deletion
     */
    static async deleteManyRemixesByPostId(postId:Types.ObjectId | string): Promise<void> {
      await RemixModel.deleteMany({ childId: postId });
    }

}

export default RemixCollection;