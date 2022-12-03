import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Post } from 'server/post/model';

export type Remix = {
    _id: Types.ObjectId;
    parentId: Types.ObjectId;
    childId: Types.ObjectId;
};

export type PopulatedRemix = {
    _id: Types.ObjectId;
    parentId: Post;
    childId: Post;
};

const RemixSchema = new Schema<Remix>({
    parentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    childId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    }
});

const RemixModel = model<Remix>('Remix', RemixSchema);
export default RemixModel;