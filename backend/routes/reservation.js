const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getReservations,
    getMyReservations,
    getReservation,
    createReservation,
    updateReservation,
    deleteReservation,
    getBookedSlots, // ✅ Add this function
    cancelReservation // ✅ Add cancelReservation function here
} = require('../controllers/reservation');

router.route('/')
    .get(protect, authorize('admin'), getReservations)
    .post(protect, createReservation);

router.get('/my', protect, getMyReservations);

// ✅ Add route to fetch booked slots for a coworking space
router.get('/booked/:coworkingSpace/:date',protect ,getBookedSlots);

router.route('/:id')
    .get(protect, getReservation)
    .put(protect, updateReservation)
    .delete(protect, deleteReservation);

// ✅ Separate route for cancelling the reservation
router.put('/:id/cancel', protect, cancelReservation); // ✅ This route handles the cancel action

module.exports = router;
