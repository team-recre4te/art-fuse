import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReportCollection from './collection';
import * as postValidator from '../post/middleware';
import * as userValidator from '../user/middleware';
import * as reportValidator from './middleware';
import * as util from './util';

const router = express.Router();

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.postId !== undefined) {
      next();
      return;
    }
    const allComments = await ReportCollection.findAll();
    const response = await Promise.all(allComments.map(util.constructReportResponse));
    console.log('response', response);
    res.status(200).json(response);
  },
  [
    postValidator.isPostQueryExists,
  ],
  async (req: Request, res: Response) => {
    const reports = await ReportCollection.findAllByPostId(req.query.postId as string);
    const response = await Promise.all(reports.map(util.constructReportResponse));
    res.status(200).json(response);
  }
);

/**
 * Add a report
 *
 * @name POST /api/reports
 *
 * @param {string} postId - The id of the post to be reported
 * @return {ReportResponse} - An object with report details
 * @throws {403} - If the user is not logged in
 * @throws {400} - If postId is not in the correct format or missing in the req
 * @throws {404} - If the postId is not valid
* @throws {403} - If the user is not an ancestor of this post
 * @throws {403} - If the user had already reported this post
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    reportValidator.isValidPostId,
    postValidator.isPostBodyExists,
    // reportValidator.isAncestorOfPost,
    reportValidator.isNotReported
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const report = await ReportCollection.addOne(userId, req.body.postId);

    res.status(200).json({
      message: 'Your report was added successfully',
      report: util.constructReportResponse(report)
    });
  }
);

/**
 * Delete a report
 *
 * @name DELETE /api/likes/:postId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the id is not valid
 * @throws {403} - If the user hadn't already reported this post
 */
 router.delete(
    '/:postId?',
    [
      userValidator.isUserLoggedIn,
      postValidator.isPostExists,
      reportValidator.isReported
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn

      await ReportCollection.deleteOne(userId, req.params.postId);
      res.status(200).json({
        message: 'Your report was deleted successfully.'
      });
    }
  );

export {router as reportRouter};
