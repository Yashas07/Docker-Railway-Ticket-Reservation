const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/logged');

const ticket = require('../controllers/ticket');

router.post('/view_booked_tickets',isAuth,ticket.postBookedTickets);

router.post('/view_details',isAuth,ticket.postViewDetails);

router.post('/deleteTicket',isAuth,ticket.postDeleteTicket);

module.exports = router;

