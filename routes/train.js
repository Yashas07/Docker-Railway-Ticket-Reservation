const express = require('express');
const train = require('../controllers/train');
const ticket = require('../controllers/ticket');
const station = require('../controllers/stations');
const nav = require('../controllers/nav');

const { check , body } = require('express-validator/check');

const isAuth = require('../middleware/logged');
const router = express.Router();



router.post('/trains',train.PostTrains);


router.post('/tickets',isAuth,ticket.postTickets);

router.post('/check_payment',isAuth,ticket.postCheckPayment);

router.get('/trainSchedule',station.getTrainSchedule);

router.post('/book',isAuth,train.bookTrains); // isAuth,

router.get('/booking',train.getBooking)   // navbar

router.get('/tickets',isAuth,ticket.getTickets);

router.post('/printTicket',ticket.postPrintTicket);

router.get('/contact',nav.getContact);

router.get('/pnr_status',nav.getPnr_status);

router.post('/check_availability',train.postCheckAvailability)

router.get('/dashboard',isAuth,nav.getDashBoard);
// router.get('/seats_calculation')

router.post('/pnrStatus',nav.postPnrStatus);

router.post('/trainSchedule',station.postTrainSchedule)

router.get('/',train.getTrains);

module.exports = router;