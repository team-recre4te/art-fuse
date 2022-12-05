import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { Post } from 'server/post/model';
import { User } from 'server/user/model';

export type Report = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
}

export type PopulatedReport = {
  _id: Types.ObjectId;
  userId: User;
  postId: Post;
  reportStatus: Boolean;
}

const ReportSchema = new Schema<Report>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
});

const ReportModel = model<Report>('Report', ReportSchema);
export default ReportModel;