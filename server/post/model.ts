import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
// import type {User} from '../user/model';

export type Post = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  // files: not sure what type
  // images: not sure what type
  dateCreated: Date;
  // parentId: Types.ObjectId; are we leaving this out?
  // reportStatus: are we leaving this out as well?
}

export type PopulatedPost = {
  _id: Types.ObjectId;
  // authorId: User;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  // files: not sure what type
  // images: not sure what type
  dateCreated: Date;
  // parentId: Post; not sure if this is being done?
  // reportStatus: not sure if this is being done?
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
  categories: {
    // type: String[], how to do list for categories, gives error
    required: true,
  },
  tags: {
    // type: String[], gives an error, not sure what to do
    required: true
  },
//   files: {
//     type: idk how to initialize this
//     required: true,
//   },
//   images: {
//     type: idk how to initialize,
//     required: true
//   },
  dateCreated: {
    type: Date,
    required: true,
  },
  // idk if we're doing parent
  // idk if we're doing report status
});

const PostModel = model<Post>('Post', PostSchema);
export default PostModel;