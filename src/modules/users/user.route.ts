import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

// create user
router.post('/', userController.createUser);
// all users
router.get('/', userController.getUsers);
// single user
// router.get('/:userId', userController.getSingleUser);
// update user
router.put('/:userId', userController.updateUser);
// delete user
router.delete('/:userId', userController.deleteUser);
export const userRoute = router;
