import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import {Tag} from '../tag/model';
import {Category} from '../category/model';
import {Like} from  '../like/model';
import type {User} from '../user/model';
import type {Comment} from '../comment/model';
import type {Report} from '../report/model';
import { Remix } from '../remix/model';

export type Post = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  title: string;
  description: string;
  files: any[];
  images: any[];
  dateCreated: Date;
  dateModified: Date;

  parentId: Post;
  likedBy?:Array<Like>;
  tags?: Array<Tag>;
  category?: Category;
  comments?: Array<Comment>;
  likes?: Array<Like>;
  reports?: Array<Report>;
  remix?: Remix;
  remixes?: Array<Remix>;
}

export type PopulatedPost = {
  _id: Types.ObjectId;
  authorId: User;
  title: string;
  description: string;
  files: any[],
  images: any[],
  dateCreated: Date;
  dateModified: Date;

  parentId: Post;
  likedBy:Array<Like>;
  tags: Array<Tag>;
  category: Category;
  comments: Array<Comment>;
  likes: Array<Like>;
  reports: Array<Report>;
  remix: Remix;
  remixes: Array<Remix>;
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
    type: [],
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

PostSchema.virtual('categories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'postId',
});

PostSchema.virtual('likedBy', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'postId'
});

const PostModel = model<Post>('Post', PostSchema);
export default PostModel;