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
        return remix.populate(['parentId','childId']);
    }

    /**
     * 
     * @param remixId 
     * @returns 
     */
    static async findOne(remixId:Types.ObjectId | string):Promise<HydratedDocument<Remix>> {
        return (await RemixModel.findOne({_id: remixId})).populate(['parentId','childId']);
    }

    /**
     * 
     * @param parentId 
     * @returns 
     */
    static async findByParent(parentId:Types.ObjectId | string): Promise<Array<HydratedDocument<Remix>>>{
        return RemixModel.find({parentId: parentId}).populate(['parentId','childId'])
    }

    /**
     * 
     * @param childId 
     * @returns 
     */
    static async findByChild(childId:Types.ObjectId | string):Promise<Array<HydratedDocument<Remix>>>{
        return RemixModel.find({childId: childId}).populate(['parentId','childId'])
    }

    static async deleteOne(remixId:Types.ObjectId | string): Promise<boolean> {
        const remix = await RemixModel.deleteOne({_id: remixId});
        return remix !== null;
    }

}

export default RemixCollection;