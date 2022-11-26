import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Post } from 'server/post/model';

export type Tag = {
  _id: Types.ObjectId;
  name: string;
  postId: Types.ObjectId;
}

export type PopulatedTag = {
  _id: Types.ObjectId;
  name: string;
  postId: Post;
}

const TagSchema = new Schema<Tag>({
  name: {
    type: String,
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
});

const TagModel = model<Tag>('Tag', TagSchema);
export default TagModel;