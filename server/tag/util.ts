import type {HydratedDocument} from 'mongoose';
import type {Tag, PopulatedTag} from '../tag/model';
import type {Post} from '../post/model';

type TagResponse = {
  _id: string;
  name: string;
  postId: Post;
};

/**
 * Transform a raw Tag object from the database into an object 
 * with all the information needed by frontend
 * 
 * @param {HydratedDocument<Tag>} tag - A tag
 * @returns {TagResponse} - The tag object formatted for the frontend
 */
const constructTagResponse = (tag: HydratedDocument<Tag>): TagResponse => {
  const tagCopy: PopulatedTag = {
    ...tag.toObject({
      versionKey: false
    })
  };

  return {
    ...tagCopy,
    _id: tagCopy._id.toString(),
  };
};

export {
    constructTagResponse
};