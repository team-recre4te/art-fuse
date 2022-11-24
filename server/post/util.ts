import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Post, PopulatedPost} from '../post/model';

type PostResponse = {
  _id: string;
  author: string;
  title: string;
  description: string;
  files: string[];
  images: string[];
  dateCreated: string;
  dateModified: string;
  parentTitle?: string;
  parent?: string;
  // reportStatus? 
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

  return {
    ...postCopy,
    _id: postCopy._id.toString(),
    author: username,
    dateCreated: formatDate(post.dateCreated),
    dateModified: formatDate(post.dateModified),
  };
};

export {
    constructPostResponse
};