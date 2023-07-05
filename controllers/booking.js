//Model
const Booking = require('../models/booking');

exports.create = async ({
    userId,
    eventId,
    date,
    payment_status
}) => {
    let booking;
    try {
        booking = await Booking.create({
            user_id: userId,
            event_id: eventId,
            date: date,
            payment_status: payment_status
        });
    } catch (err) {
        err.message = 'Internal server error';
        err.statusCode = 500;
        return err;
    }
    return {
        statusCode: 201,
        message: 'Booking created successfully',
    }
}

exports.getBooking = async ({
    bookingId,
    userId
}) => {
    let booking;
    try {
        booking = await Booking.findByPk(bookingId);
    } catch (err) {
        err.message = 'Internal server error';
        err.statusCode = 500;
        return err;
    }
    if (!booking) {
        const err = new Error('Booking not found');
        err.message = 'Booking not found';
        err.statusCode = 404;
        return err;
    }
    if (booking.user_id !== userId) {
        const err = new Error('Not authorized');
        err.message = 'Not authorized';
        err.statusCode = 403;
    }
    return {
        userId: booking.user_id,
        eventId: booking.event_id,
        date: booking.date,
        payment_status: booking.payment_status
    }
}

exports.delete = async ({
    bookingId,
    userId
}) => {
    let booking;
    try {
        booking = await Booking.findByPk(bookingId);
    } catch (err) {
        err.message = 'Internal server error';
        err.statusCode = 500;
        return err;
    }
    if (!booking) {
        const err = new Error('Booking not found');
        err.message = 'Booking not found';
        err.statusCode = 404;
        return err;
    }
    if (booking.user_id !== userId) {
        const err = new Error('Not authorized');
        err.message = 'Not authorized';
        err.statusCode = 403;
    }
    try {
        await booking.destroy();
    } catch (err) {
        err.message = 'Internal server error';
        err.statusCode = 500;
        return err;
    }
    return {
        statusCode: 200,
        message: 'Booking deleted successfully'
    }
}