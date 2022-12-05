import type {HydratedDocument} from 'mongoose';
import type {Remix, PopulatedRemix} from '../remix/model';
import type {Post} from '../post/model';

type RemixResponse = {
    _id : string;
    parentId: Post;
    childId: Post;
}

/**
 * Transform a raw Remix object from the database into an object 
 * with all the information needed by frontend
 * 
 * @param {HydratedDocument<Remix>} remix - A remix
 * @returns {RemixResponse} - The remix object formatted for the frontend
 */
 const constructRemixResponse = (remix: HydratedDocument<Remix>): RemixResponse => {
    const remixCopy: PopulatedRemix = {
      ...remix.toObject({
        versionKey: false
      })
    };
  
    return {
      ...remixCopy,
      _id: remixCopy._id.toString(),
    };
};
  
export {
      constructRemixResponse
  };