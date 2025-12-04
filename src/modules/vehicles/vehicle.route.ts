import express from 'express';
import { vehicleController } from './vehicle.controller';

const router = express.Router();

// Create Vehicle
router.post('/', vehicleController.createVehicle);
// all vehicles
router.get('/', vehicleController.getVehicle);
// single vehicle
router.get('/:vehicleId', vehicleController.getSingleVehicle);
// update vehicle
router.put('/:vehicleId', vehicleController.updateVehicle);
// delete vehicle
router.delete('/:vehicleId', vehicleController.deleteVehicle);


export const vehicleRoute = router;
