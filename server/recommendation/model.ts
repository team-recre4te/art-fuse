import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Post} from '../post/model';

export type Recommendation = {
    _id: Types.ObjectId;
    userId:  Types.ObjectId;
    recommendations: Types.ObjectId[];
    dateCreated: Date;
}

export type PopulatedRecommendation = {
    _id: Types.ObjectId;
    userId:  User;
    recommendations: Post[];
    dateCreated: Date;
}

const RecommendationSchema = new Schema<Recommendation>({
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

const RecommendationModel = model<Recommendation>('Recommendation', RecommendationSchema);
export default RecommendationModel;