import type {HydratedDocument, Types} from 'mongoose';
import type {Report} from './model';
import ReportModel from './model';

class ReportCollection {
    /**
     * Report a post
     *
     * @param {string} userId - The userId of the person reporting the post
     * @param {string} postId - The postId of the post to report
     * @return {Promise<HydratedDocument<Like>>} - The newly created report
     */
  static async addOne(userId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<HydratedDocument<Report>> {

    const report = new ReportModel({
        userId,
        postId,
    });
    await report.save();
    return report.populate('postId');
  }

  /**
   * Find a report using userId and postId
   * 
   * @param {string} reportId - The id of the report to find
   * @return {Promise<HydratedDocument<Report>> | Promise<null> } - The report with the given reportId, if any
   */
   static async findOne(userId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<HydratedDocument<Report>> {
    return ReportModel.findOne({userId: userId, postId: postId}).populate('userId');
}

  /**
   * Get all the reports in the database
   * 
   * @return {Promise<HydratedDocument<Report>[]>} - An array of all of the reports
   */
  static async findAll(): Promise<Array<HydratedDocument<Report>>> {
    return ReportModel.find({}).populate('postId');
  }

  /**
   * Get all reports by given postId
   *
   * @param {string} postId - The postId of post that reports are being searched for
   * @return {Promise<HydratedDocument<Report>[]>} - An array of all of the posts
   */
   static async findAllByPostId(postId: string): Promise<Array<HydratedDocument<Report>>> {
    return ReportModel.find({postId}).populate('postId');
  }

  /**
     * Delete a like from the collection
     *
     * @param {string} userId - The userId of user
     * @param {string} postId - The postId of the post to remove the report from for user with userId
     * @return {Promise<Boolean>} - true if the report has been deleted, false otherwise
     */
   static async deleteOne(userId: Types.ObjectId | string, postId: Types.ObjectId | string): Promise<boolean> {
    const report = await ReportModel.deleteOne({userId: userId, postId: postId});
    return report !== null;
  }

  /**
   * Delete all the reports by the given post
   *
   * @param {string} postId - The id of the post with the reports
   */
   static async deleteMany(postId: Types.ObjectId | string): Promise<void> {
    await ReportModel.deleteMany({postId});
  }

}

export default ReportCollection;