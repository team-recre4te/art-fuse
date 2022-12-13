import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Post} from '../post/model';
import PostCollection from '../post/collection';

/**
 * This file defines the properties stored in a liked Post
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
export type Comment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId; // the user who comments on the Post
  postId: Types.ObjectId; // post being commented on
  content: string;
  dateCommented: Date;
};

export type PopulatedComment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User; // the user who comments on the Post
  postId: Post;
  content: string;
  dateCommented: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Likes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB

const CommentSchema = new Schema<Comment>({
  // The author userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  postId:{
    type: Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  // The date the comment was created
  dateCommented: {
    type: Date,
    required: true
  },
});

const CommentModel = model<Comment>('comment', CommentSchema);
export default CommentModel;
