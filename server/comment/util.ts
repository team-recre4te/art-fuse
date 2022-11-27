import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Comment, PopulatedComment} from '../comment/model';
import PostModel from '../post/model';
import CommentModel from '../comment/model';
import type {PostResponse} from '../post/util';
import {constructPostResponse} from '../post/util';
import type {Post, PopulatedPost} from '../post/model';

// Update this if you add a property to the Post or Comment type!

type CommentResponse = {
  _id: string;
  user: string;
  post: PostResponse | null;
  content: string;
  dateCommented: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw comment object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
 const constructCommentResponse = async (comment: HydratedDocument<Comment>): Promise<CommentResponse> => {
    const commentCopy: PopulatedComment = {
      ...comment.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const {username} = commentCopy.userId;
    // const {content} = commentCopy.content;

    let post = null;
    const target_post = await PostModel.findOne({_id: commentCopy.postId});
    post = constructPostResponse(target_post); //inside constructPostResponse we don't use await 
  
    delete commentCopy.userId;
    
    return {
      ...commentCopy, // return all the fields of comment copy
      _id: commentCopy._id.toString(),
      user: username,
      // content: content,
      post: post,
      dateCommented: formatDate(comment.dateCommented),
    };
  };
  
  export {
    constructCommentResponse,
    CommentResponse
  };
