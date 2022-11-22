import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Post, PopulatedPost} from '../post/model';

type PostResponse = {
  _id: string;
  author: string;
  title: string;
  description: string
  categories: string[],
  tags: string[],
  // files?
  // images?
  dateCreated: string;
  // parent?
  // reportStatus? 
}