import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Post = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  title: string;
  description: string;
  files: any[];
  images: string[];
  dateCreated: Date;
  dateModified: Date;
  parentId: Types.ObjectId;
}

export type PopulatedPost = {
  _id: Types.ObjectId;
  authorId: User;
  title: string;
  description: string;
  files: any[],
  images: string[],
  dateCreated: Date;
  dateModified: Date
  parentId: Post; 
}

const PostSchema = new Schema<Post>({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  files: {
    type: [],
    required: true,
  },
  images: {
    type: [String],
    required: true
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  dateModified: {
    type: Date,
    required: true,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Post'
  },
});

const PostModel = model<Post>('Post', PostSchema);
export default PostModel;