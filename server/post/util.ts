import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Post, PopulatedPost} from '../post/model';

import type {Comment} from '../comment/model';
import * as commentUtil from '../comment/util';
import { CommentResponse } from '../comment/util';
import type {User} from '../user/model';
import { Category } from '../category/model';
import { Tag } from '../tag/model';
import { Like } from '../like/model';
import { Remix } from '../remix/model';
import * as remixUtil from '../remix/util';
import { Report } from '../report/model';

type PostResponse = {
  // main post info
  _id: string;
  author: string;
  title: string;
  description: string;
  files: string[];
  images: string[];
  dateCreated: string;
  dateModified: string;

  // other post info
  parentId: Post;
  category: Category;
  tags: Tag[];
  likes: Like[];
  comments: CommentResponse[];
  remixes: Remix[];
  reports: Report[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
 const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Post object from the database into an object 
 * with all the information needed by frontend
 * 
 * @param {HydratedDocument<Post>} post - A post
 * @returns {PostResponse} - The post object formatted for the frontend
 */
const constructPostResponse = (post: HydratedDocument<Post>): PostResponse => {
  const postCopy: PopulatedPost = {
    ...post.toObject({
      versionKey: false
    })
  };

  const {username} = postCopy.authorId;
  delete postCopy.authorId;
  const postComments = post.comments ? post.comments.map(commentUtil.constructCommentResponse) : [];

  return {
    ...postCopy,
    _id: postCopy._id.toString(),
    author: username,
    dateCreated: formatDate(post.dateCreated),
    dateModified: formatDate(post.dateModified),
    parentId: post.parentId,
    category: post.category,  
    likes: post.likes,
    comments: postComments,
    remixes: post.remixes,
    reports: post.reports
  };
};

export {
  constructPostResponse,
  PostResponse
};