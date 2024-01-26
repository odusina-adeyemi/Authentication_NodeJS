import {Router} from "express";
const router = Router();
import bodyParser from 'body-parser';
import express from 'express';

const app = express();

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));


/** Import all controllers */
import * as controller from "../controller/appController.js";
import {registerMail} from "../controller/mailer.js"
import Auth, {localVariables} from '../middleware/auth.js ';



/** POST  Methods */
router.route('/register').post(controller.register)  // register user
router.route('/registerMail').post(registerMail);    //send mail
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); //authenticate user
router.route('/login').post(controller.verifyUser, controller.login);   //login app



/** GET Methods */
router.route('/user/:username').get(controller.getUser);
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP);
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP);
router.route('/createResetSession').get(controller.createResetSession);





/** PUT Methods */

router.route('/updateuser').put(Auth, controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);



export default router;


