import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Post} from '../post/model';

export type Notification = {
    _id: Types.ObjectId;
    userId:  Types.ObjectId;
    recommendations: Types.ObjectId[];
    dateCreated: Date;
}

export type PopulatedNotification = {
    _id: Types.ObjectId;
    userId:  User;
    recommendations: Post[];
    dateCreated: Date;
}

const NotificationSchema = new Schema<Notification>({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    recommendations:{
        type: [String],
        required: true
    },
    dateCreated: {
        type: Date,
        required: true,
    }
});

const NotificationModel = model<Notification>('Notification', NotificationSchema);
export default NotificationModel;