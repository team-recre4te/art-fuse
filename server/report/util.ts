import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {Report} from './model';
import UserCollection from '../user/collection';

// Update this if you add a property to the User type!
type ReportResponse = {
  _id: string;
  userId: Object;
};

/**
 * Transform a raw Report object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Report>} report - A report object
 * @returns {ReportResponse} - The report object
 */
const constructReportResponse = (report: HydratedDocument<Report>): ReportResponse => {
  const reportCopy: Report = {
    ...report.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  
  return {
    ...reportCopy,
    _id: reportCopy._id.toString(),
  };
};

export {
    constructReportResponse
};