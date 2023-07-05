//Models
const Event = require('../models/event');

exports.createEvent = async ({
    userId,
    title,
    description,
    date,
    address,
    ticket_price
}) => {
    let event;
    try {
        event = await Event.create({
            title: title,
            description: description,
            date: date,
            address: address,
            organizer_id: userId,
            ticket_price: ticket_price
        });
    } catch (err) {
        err.message = 'Event creation failed';
        err.statusCode = 500;
        return err;
    }
    return {
        message: 'Event created successfully',
        statusCode: 201
    };
};

exports.getEvent = async ({
    eventId
}) => {
    let event;
    try {
        event = await Event.findByPk(eventId);
    } catch (err) {
        err.message = 'Internal Server Error';
        err.statusCode = 500;
        return err;
    }
    if (!event) {
        const err = new Error('Event not found');
        err.message = 'Event not found';
        err.statusCode = 404;
        return err;
    }
    return {
        title: event.title,
        description: event.description,
        date: event.date,
        address: event.address,
        organizer_id: event.organizer_id,
        ticket_price: event.ticket_price
    }
};

exports.updateEvent = async ({
    userId,
    eventId,
    title,
    description,
    date,
    address,
    ticket_price
}) => {
    let event;
    try {
        event = await Event.findByPk(eventId);
    } catch (err) {
        err.message = 'Internal Server Error';
        err.statusCode = 500;
        return err;

    }
    if (!event) {
        const err = new Error('Event not found');
        err.statusCode = 404;
        return err;
    }
    if (event.organizer_id !== userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        return err;
    }
    try {
        await event.update({
            title: title,
            description: description,
            date: date,
            address: address,
            ticket_price: ticket_price
        });
    } catch (err) {
        err.message = 'Event updation failed';
        err.statusCode = 500;
        return err;
    }
    return {
        message: 'Event updated successfully',
        statusCode: 200
    }
};

exports.deleteEvent = async ({
    eventId,
    userId
}) => {
    let event;
    try {
        event = await Event.findByPk(eventId);
    } catch (err) {
        err.message = 'Internal Server Error';
        err.statusCode = 500;
        return err;

    }
    if (!event) {
        const err = new Error('Event not found');
        err.statusCode = 404;
        return err;
    }
    if (event.organizer_id !== userId) {
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        return err;
    }
    try {
        await event.destroy();
    } catch (err) {
        err.message = 'Event deletion failed';
        err.statusCode = 500;
        return err;
    }
    return {
        message: 'Event deleted successfully',
        statusCode: 200
    }
};