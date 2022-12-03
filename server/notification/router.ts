import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import NotificationCollection from './collection';
import * as userValidator from '../user/middleware';
import * as postValidator from '../post/middleware';
// import * as util from './util';

