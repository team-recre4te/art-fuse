import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Tag } from '../tag/model';
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
  tags?: Array<Tag>;
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

PostSchema.virtual('tags', {
  ref: 'Tag',
  localField: '_id',
  foreignField: 'postId',
});

// PostSchema.virtual('likedBy', {
//   ref: 'Like',
//   localField: '_id',
//   foreignField: 'postId',
// });

const PostModel = model<Post>('Post', PostSchema);
export default PostModel;