import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Post } from 'server/post/model';

export type Category = {
  _id: Types.ObjectId;
  name: string;
  postId: Types.ObjectId;
}

export type PopulatedCategory = {
  _id: Types.ObjectId;
  name: string;
  postId: Post;
}

const CategorySchema = new Schema<Category>({
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

const CategoryModel = model<Category>('Category', CategorySchema);
export default CategoryModel;