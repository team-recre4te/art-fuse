import type {HydratedDocument, Types} from 'mongoose';
import type {Notification} from './model';
import NotificationModel from './model';
import UserCollection from '../user/collection';
import PostCollection from '../post/collection';

class NotificationCollection {
    
    /**
     * add a notification
     * @param userId the user requesting a notification
     * @returns {Promise<HydratedDocument<Notification>>} a notification with recommendations of projects to work on
     */
    static async addOne(userId:Types.ObjectId|string):Promise<HydratedDocument<Notification>>{
        const date = new Date();
        const user = await UserCollection.findOneByUserId(userId);
        const recommendations:string[] = []
        for (const pref of user.preferences){
            //find the most liked post with the current preference
            //add the post
        }
        const notification = new NotificationModel({
            userId,recommendations,date
        })
        await notification.save();
        return notification.populate(['userId','recommendations']);
    }
    /**
     * find all notifications made for a
     * @param userId the user requesting a notification
     * @returns {Promise<HydratedDocument<Notification>>[]} array of notifications
     */
    static async findForUser(userId:Types.ObjectId|string):Promise<HydratedDocument<Notification>[]>{
        return NotificationModel.find({userId: userId}).sort({dateCreated: -1}).populate(['userId','recommendations'])
    }

    static async deleteOne(notificationId:Types.ObjectId|string):Promise<boolean>{
        const notif = await NotificationModel.deleteOne({_id: notificationId});
        return notif !== null;
    }
}

export default NotificationCollection;