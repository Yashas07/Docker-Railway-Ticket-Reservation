const db = require('../util/database');
const express = require('express');
const fs = require('fs');
const path =  require('path');
const PDFDocument = require('pdfkit');
const { QueryTypes } = require('sequelize');
const app = express();

app.locals.confirmed_seats_cancelled = {};


exports.postPrintTicket = (req,res,next) => {
    const pnr = req.body.pnr;
    const ticket_id = req.body.ticket_id;
    const arrival_time = req.body.arrival_time;
    const departure_time = req.body.departure_time;
    const duration = req.body.duration;
    const distance = req.body.distance;
    const train_name = req.body.train_name;
    const new_dates = req.body.new_dates;

    let str = '     Name                Age   Gender   Seat-Number   Coach-Number   Ticket-Status';
    db.query(`select * from passengers join ticket where tick_id=ticket_id and tick_id=${ticket_id}`)
    .then(([result,metadata]) => {
        console.log(result);

        const pdf_name = 'ticket'+'-'+ pnr +'.pdf';
        const pdf_path = path.join('data','tickets',pdf_name);
    
        const pdfDoc = new PDFDocument();
    
        res.setHeader('Content-Type' , 'application/pdf');
        res.setHeader('Content-Disposition','attachment; filename=" ' + pdf_name + ' "');
        pdfDoc.pipe(fs.createWriteStream(pdf_path));
        pdfDoc.pipe(res);
    
        pdfDoc.fontSize(26).text('Indian Railways',{
            underline : true,
            align : 'center'
            
        });
    
        pdfDoc.moveDown();
        
        pdfDoc.fontSize(20).text(`Date : ${result[0].Date}                              Time : ${result[0].time} `)

        pdfDoc.moveDown();

        pdfDoc.fontSize(23).text(`PNR Number : ${pnr}`,{
            align : 'center'
        })

        pdfDoc.moveDown();

        
        pdfDoc.fontSize(13).text(`Train-Number : ${result[0].train_id}                Train-Name : ${train_name} `)
        pdfDoc.moveDown();
        pdfDoc.fontSize(13).text(`Departure :  ${result[0].journey_date},${departure_time} hrs              Arrival :  ${result[0].arrival_date},${arrival_time} hrs`)
        pdfDoc.moveDown();
        pdfDoc.fontSize(13).text(`From : ${result[0].source}                          To : ${result[0].destination}     Distance : ${distance} km`)
        pdfDoc.moveDown();
        pdfDoc.fontSize(13).text(`Class : ${result[0].class}                           Date-Of-Journey : ${result[0].journey_date}     Duration(hrs) : ${duration}`)   
        pdfDoc.moveDown();
        
        pdfDoc.fontSize(13).lineWidth(3).text(str,{
            columnGap : 10,
            underline : true
        })

        pdfDoc.moveDown();

        let max_length= 0;
        for(let i = 0;i<result.length;i++)
        {
            max_length = Math.max(max_length,result[i].name.toString().length)
        }
        for(let i = 0;i<result.length;i++)
        {
            if(result[i].ticket_status.toString().slice(0,3)=='CNF')
            {
                result[i].ticket_status = 'Confirmed'
            }
            else
            {
                result[i].ticket_status = 'Waiting/'+result[i].ticket_status;
                result[i].status_num = '--';
                result[i].coach_no = '--';
            }
            let copy_of_max_length = max_length;
            console.log(max_length);
            if(result[i].name.toString().length < max_length)
            {
                
                for(let j = result[i].name.toString().length;j<copy_of_max_length;j++)
                {
                result[i].name =  result[i].name + '  '
                
                console.log(copy_of_max_length);
                }

                console.log(result[i].name.toString().length);
            }
            pdfDoc.fontSize(13).text(`${i+1}     ${result[i].name}              ${result[i].age}        ${result[i].gender}             ${result[i].status_num}                ${result[i].coach_no}                    ${result[i].ticket_status}`)

        }

        pdfDoc.moveDown();

        pdfDoc.fontSize(15).text(`Fare : Rs.${result[0].price}`,{
            align : 'center'
        })
    
        pdfDoc.end();
       // return res.redirect('/booking');
    })
    .catch(err => {
        console.log(err);
    })

    console.log(ticket_id);
    //console.log(passengers);
    
    
   
    
}

exports.postDeleteTicket = (req,res,next) => {
    const ticket_id = req.body.ticket_id;
    let passengers_to_be_deleted = req.body.passengers_to_be_deleted;
    
    let total_passengers_length = req.body.total_passengers_length;
    let state = false;
    if(passengers_to_be_deleted.length==total_passengers_length)
    
    {
        // delete all the passengers
        state = 'all';
    }
    let passenger_ids = [];
    for(let cur of passengers_to_be_deleted)
    {
        passenger_ids.push(cur);
    }
    console.log(passengers_to_be_deleted);
    console.log(passenger_ids);
    console.log('passengers_to_be_deleted.length = ');
    console.log(passengers_to_be_deleted.length);
    console.log('total_passengers_length = ');
    console.log(total_passengers_length);
    console.log(state);
    console.log(ticket_id);
    let confirmed_seats = 0;
    
    let wl_seats = 0;
    let max_confirmed_seats = 0;

    let max_wl_seats = 0;
    let no_of_coaches = 0;
    let date ;
    let train_id;
    let train_class;
    let deleting_tickets = {};
    
    let wl_updated = {
        status_num : [],
        ticket_status : [],
        coach_no : []
    };
    let no_of_waitlisted_tickets = 0;
    let max_waitlist_value = 0;
    let min_waitlist_value = Number.MAX_VALUE;
    let price = 0;
    let updatedPrice = 0;
    let consider_new_updation = false;
    let new_diff = false;

    let query = `select * from passengers join ticket on  tick_id=ticket_id and tick_id=${ticket_id} and id in (:passenger_ids)`
    db.query(query,{
        replacements : { passenger_ids : passenger_ids },
        type : QueryTypes.SELECT
    })
    .then((result) => {
        console.log(result);
        price = (result[0].price / result[0].no_of_seats);
        updatedPrice = result[0].price - (price*passengers_to_be_deleted.length);
        for(let i = 0;i<result.length;i++)
        {
            console.log(result[i].ticket_status.toString().slice(0,2));
            if(result[i].ticket_status.toString().slice(0,2)=='WL')
            {
                no_of_waitlisted_tickets++;
                max_waitlist_value=  Math.max(max_waitlist_value,result[i].status_num);
                min_waitlist_value = Math.min(min_waitlist_value,result[i].status_num);
                console.log(result[i].status_num);
            }
        }

        if(no_of_waitlisted_tickets==2)
        {
            if(max_waitlist_value-min_waitlist_value>1)
            {
                // consider different updating strategy
                // i.e new update needs to be added
                consider_new_updation = 'two';
                new_diff = max_waitlist_value-min_waitlist_value;
            }
        }
        let second_max;         // to get to know the inbetween number for decrementing
        if(no_of_waitlisted_tickets==3)
        {
            if(max_waitlist_value-min_waitlist_value>2)
            {
                // consider different updating strategy
                // i.e new update needs to be added
                for(let i = 0;i<result.length;i++)
                {
                    if(result[i].status_num!=max_waitlist_value || result[i].status_num!=min_waitlist_value)
                    {
                        second_max = result[i].status_num;
                    }
                }
                consider_new_updation = 'three';
                new_diff = max_waitlist_value-min_waitlist_value;
            }
        }

    train_class = result[0].class;
    date = result[0].journey_date;
    train_id = result[0].train_id;

    return db.query(`SELECT count(status_num) AS confirmed_seats FROM passengers WHERE ticket_status LIKE 'CNF%' and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)

    })
   .then(([result,metadata]) => {
        console.log(result);
        if(result[0].confirmed_seats == null)
        {
            confirmed_seats = 0;
        }
        else
        {
        confirmed_seats = parseInt(result[0].confirmed_seats);
        }
        return db.query(`SELECT max(status_num) AS wl_seats FROM passengers WHERE ticket_status LIKE 'WL%' and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
    })
    .then(([result,metadata]) => {
        console.log(result);
        if(result[0].wl_seats == null)
        {
            wl_seats = 0;
        }
        else
        {
        wl_seats = parseInt(result[0].wl_seats);
        }
        return db.query(`select max_seats,wl_max, no_of_coaches from class_details where trains_id=${train_id}  AND class_id=(select id from class where class='${train_class}')`)
    })
    .then(([result,metadata]) => {
        console.log(result);
        
        max_confirmed_seats = parseInt(result[0].max_seats) *parseInt(result[0].no_of_coaches);
        // 2 seats  = 1 berth
        
        max_wl_seats = parseInt(result[0].wl_max);
        no_of_coaches = parseInt(result[0].no_of_coaches);
        console.log(max_confirmed_seats,max_wl_seats);

        return db.query(query,{
            replacements : { passenger_ids : passenger_ids },
            type : QueryTypes.SELECT
        })
    })
    .then((passengers) => {
        console.log(passengers);
        let incremented_tickets = no_of_waitlisted_tickets;
        let passenger = passengers[0].train_id+'-'+passengers[0].class+'-'+passengers[0].journey_date;
        if(app.locals.confirmed_seats_cancelled[passenger])
        {
            console.log('yes worked');
            for (let i of passengers)
            {
                if(i.ticket_status.toString().slice(0,3)=='CNF')
                {
                    if(max_confirmed_seats > confirmed_seats)
                    {
                        // So no wl tickets
                        // delete and store

                        app.locals.confirmed_seats_cancelled[passenger].push(i.status_num);
                       


                    }
                    else
                    {
                        if(wl_seats==0)
                        {
                            // Dont update just store values
                            // waiting list is not affected
                            app.locals.confirmed_seats_cancelled[passenger].push(i.status_num);
                        }
                        else
                        {
                            
                            if(wl_updated.status_num.length<wl_seats)
                            {
                                console.log('entered first if');
                                // there is a  waitlist
                                // waitlist needs to be updated
                                if(incremented_tickets<wl_seats)
                                {
                                    console.log('entered second if')
                                    wl_updated.status_num.push(i.status_num);
                                    wl_updated.ticket_status.push(i.ticket_status);
                                    wl_updated.coach_no.push(i.coach_no);
                                    incremented_tickets++;
                                }
                                else
                                {
                                    app.locals.confirmed_seats_cancelled[passenger].push(i.status_num);
                                }
                               
                            }
                            else
                            {
                                app.locals.confirmed_seats_cancelled[passenger].push(i.status_num);
                            }
                            
                            
                        }
                    }
                    
                }
               
            }
        }
        else
        {
            let arr = [];
            for (let i of passengers)
            {
                
                    if(i.ticket_status.toString().slice(0,3)=='CNF')
                {
                    if(max_confirmed_seats > confirmed_seats)
                    {
                        // So no wl tickets
                        // delete and store

                       arr.push(i.status_num);
                       


                    }
                    else
                    {
                        if(wl_seats==0)
                        {
                            // Dont update just store values
                            // waiting list is not affected
                           arr.push(i.status_num);
                        }
                        else
                        {
                            if(wl_updated.status_num.length<wl_seats)
                            {
                            
                                // there is a  waitlist
                                // waitlist needs to be updated
                                if(incremented_tickets<wl_seats)
                                {
                               wl_updated.status_num.push(i.status_num);
                               wl_updated.ticket_status.push(i.ticket_status);
                               wl_updated.coach_no.push(i.coach_no);
                                }
                                else
                                {
                                    arr.push(i.status_num);
                                }
                            }
                            else
                            {
                                arr.push(i.status_num);
                            }
                            
                            
                        }
                    }
                    
                }
                
            }
        
        app.locals.confirmed_seats_cancelled[passenger] = arr;
        }
        
        console.log(app.locals.confirmed_seats_cancelled);
        console.log('wl_seats =');
            console.log(wl_seats);
            console.log('wl_updated_length = ');
            console.log(wl_updated.status_num.length);
        if(wl_seats>=wl_updated.status_num.length)
        {
            console.log('wl_seats =');
            console.log(wl_seats);
            console.log('wl_updated_length = ');
            console.log(wl_updated.status_num.length);
            console.log('reached 1');
           
            if(no_of_waitlisted_tickets==0)
            {
                console.log('reached inside 1');
                max_waitlist_value = wl_updated.status_num.length;
                //return db.query(`update passengers set status_num = status_num-${wl_updated.status_num.length + no_of_waitlisted_tickets} where ticket_status LIKE 'WL%' and  status_num > ${max_waitlist_value} and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
            }
            else
            {
                console.log('reached inside 2');
            //return db.query(`update passengers set status_num = status_num-${wl_updated.status_num.length + no_of_waitlisted_tickets} where ticket_status LIKE 'WL%' and  status_num > ${max_waitlist_value} and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
            }
        }

        if(state=='all')
        {
        return db.query(`delete from ticket where ticket_id=${ticket_id}`)
        }
        else
        {
        for(let i = 0;i<passengers_to_be_deleted.length;i++)
        {
            db.query(`delete from passengers where id=${passengers_to_be_deleted[i]} and tick_id=${ticket_id}`);
        }
        db.query(`update ticket set no_of_seats=no_of_seats-${passengers_to_be_deleted.length},price=price-${price*passengers_to_be_deleted.length} where ticket_id=${ticket_id}`)
        }
        //added for synchronous flow
        return db.query(`select * from class`);
        
    })
    .then(result => {
        console.log(wl_updated.status_num.length)
        for(let i = 0;i<wl_updated.status_num.length;i++)
        {
         db.query(`update passengers set status_num=${wl_updated.status_num[i]},ticket_status='${wl_updated.ticket_status[i]}',coach_no='${wl_updated.coach_no[i]}' where ticket_status LIKE 'WL%' and status_num=${i+1+no_of_waitlisted_tickets} and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
        }
        return db.query('select * from class');
    
    })
    .then(result => {
        if(consider_new_updation=='two')
        {
            if(new_diff>2)
            {
                db.query(`update passengers set status_num = status_num-${wl_updated.status_num.length +1} where ticket_status LIKE 'WL%' and  status_num > ${min_waitlist_value}  and status_num < ${max_waitlist_value-1} and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
                db.query(`update passengers set status_num = status_num-${wl_updated.status_num.length +1} where ticket_status LIKE 'WL%' and  status_num > ${min_waitlist_value+1}  and status_num < ${max_waitlist_value} and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
    
            }
            else
            {
             db.query(`update passengers set status_num = status_num-${wl_updated.status_num.length + new_diff-1} where ticket_status LIKE 'WL%' and  status_num > ${min_waitlist_value}  and status_num < ${max_waitlist_value} and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
            }
        }

        if(consider_new_updation=='three')
        {
            if(second_max==2)
            {
                db.query(`update passengers set status_num = status_num-${wl_updated.status_num.length +1} where ticket_status LIKE 'WL%' and  status_num > ${min_waitlist_value}  and status_num < ${max_waitlist_value-1} and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
            }
            else
            {
                db.query(`update passengers set status_num = status_num-${wl_updated.status_num.length +2} where ticket_status LIKE 'WL%' and  status_num > ${min_waitlist_value+1}  and status_num < ${max_waitlist_value} and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
            }
        }
        return db.query(`select * from class`);
        
        })
    .then(result => {
        return db.query(`update passengers set status_num = status_num-${wl_updated.status_num.length + no_of_waitlisted_tickets} where ticket_status LIKE 'WL%' and  status_num > ${max_waitlist_value} and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
    })
    .then(result => {
        console.log(result);
        return res.json({
            passengers : 'Done',
            updatedPrice : updatedPrice

        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postViewDetails = (req,res,next) => {
    const ticket_id = req.body.ticket_id;
    console.log(ticket_id);
    db.query(`select * from passengers where tick_id='${ticket_id}'`)
    .then(([passengers,metadata]) => {
        console.log(passengers);
        //console.log(app.locals.confirmed_seats_cancelled);
        return res.json({
            passengers : passengers
        })
    })
    .catch(err => {
        console.log(err);
    })
}



exports.postBookedTickets = (req,res,next) => {
    
    
    if(req.session.user)
    {
        const user_id = req.session.user.id;
    db.query(`select * from ticket join train on user_id=${user_id} and train_id = id`)
    .then(([result,metadata]) => {
        console.log(result);
       for(let i =0;i<result.length;i++)
       {
        const d = new Date(result[i].Date)
        result[i].Date = d.toString().slice(4,15);
        console.log(d.toString())
       }
        return res.render('dashboard',{
            tickets : result,
            isLoggedIn : req.session.isLoggedIn,
            user : req.session.user,
            page : 'dashboard',
            title : 'Dashboard',
            set : true
        })
    })
    }
    else
    {
        return res.redirect('/login');
    }
   
}

exports.postTickets = (req,res,next) => {

var passenger = [];
var passenger_1 = {};
var passenger_2 = {};
var passenger_3 = {};
var passenger_4 = {};
var age_1;
var age_2;
var age_3;
var age_4;
var x = 1;
const user_id = req.session.user.id;

let seat_no = 0;

let wl_no = 0;

passenger_1.name = req.body.passenger_name_1;
passenger_1.age = req.body.age_1;
passenger_1.gender = req.body.gender_1;
console.log(passenger_1);


passenger.push(passenger_1);





if(req.body.passenger_name_2 && req.body.age_2)
{

passenger_2.name = req.body.passenger_name_2;
passenger_2.age = req.body.age_2;
passenger_2.gender = req.body.gender_2;
console.log(passenger_2);
passenger.push(passenger_2);
x++;
}


if(req.body.passenger_name_3 && req.body.age_3)
{

passenger_3.name = req.body.passenger_name_3;
passenger_3.age = req.body.age_3;
passenger_3.gender = req.body.gender_3;
console.log(passenger_3);
passenger.push(passenger_3);
x++;
}

if(req.body.passenger_name_4 && req.body.age_4)
{

passenger_4.name = req.body.passenger_name_4;
passenger_4.age = req.body.age_4;
passenger_4.gender = req.body.gender_4;
console.log(passenger_4);
passenger.push(passenger_4);
x++;
}

console.log(passenger);
const source=req.body.source;
const destination = req.body.destination;
const train_class = req.body.train_class;
const distance = req.body.distance;
const train_type = req.body.train_type;    
const train_id = req.body.train_id;
const dates = req.body.dates;
const train_name = req.body.train_name;
const arrival_time = req.body.arrival_time;
const departure_time = req.body.departure_time;
const duration = req.body.duration;
const new_dates = req.body.new_dates;
arr = {
    source : source,
    destination : destination,
    train_class : train_class,
    distance : distance,
    train_type : train_type,
    train_id : train_id ,
    dates :  dates ,
    passenger : passenger,
    
    train_name : train_name,
    price : 0,
    pnr : 0,
    booked_date : 0,
    booked_time : 0
}

arr.arrival_time = arrival_time;
arr.departure_time = departure_time;
arr.duration = duration;
arr.new_dates = new_dates;

                let price = 0;
                
                if(train_type=='Shatabdhi' || train_type=='Duronto' || train_type=='Rajdhani')
                {
                    let incr = 100;
                    if(train_class=='2S')
                    { /*General */
                     incr = 90;
                     price = 100;
                    }
                    else if(train_class=='SL')
                    {
                     incr = 140;
                     price = 150;
                    }
                    else if(train_class=='CC')
                    {
                        incr = 150;
                        price = 160;
                    }
                    else if(train_class=='3E')
                    {
                        incr = 155;
                        price = 165;
                    }
                    else if(train_class=='3A')
                    {
                     incr = 160;
                     price = 170;
                    }
                     else if(train_class=='2A')
                     {
                     incr = 240;
                     price = 250;
                     }
                     else if(train_class=='EC')
                     {
                        incr = 260;
                        price = 270;
                     }
                     else if(train_class=='1A')
                     {
                     incr = 290;
                     price = 300;
                     }
                    for(let i = 120;i<=3000;i = i + 120)
                    {
                        if(distance<=i)
                        {
                            price = price;
                            break;
                        }
                        price = price + incr;;
                    }
                }
                else if(train_type=='Super-fast')
                {
                    let incr = 100;
                    if(train_class=='2S')
                    { /*General */
                     incr = 70;
                     price = 80;
                    }
                    else if(train_class=='SL')
                    {
                     incr = 120;
                     price = 130;
                    }
                    else if(train_class=='CC')
                    {
                        incr = 130;
                        price = 140;
                    }
                    else if(train_class=='3E')
                    {
                        incr = 135;
                        price = 145;
                    }
                    else if(train_class=='3A')
                    {
                     incr = 140;
                     price = 150;
                    }
                     else if(train_class=='2A')
                     {
                     incr = 220;
                     price = 230;
                     }
                     else if(train_class=='EC')
                     {
                        incr = 240;
                        price = 250;
                     }
                     else if(train_class=='1A')
                     {
                     incr = 280;
                     price = 280;
                     }
                    for(let i = 80;i<=3000;i = i + 80)
                    {
                        if(distance<=i)
                        {
                            price = price;
                            break;
                        }
                        price = price + incr;;
                    }
                }
                else if(train_type=='Express' || train_type=='Intercity')
                {
                    let incr = 100;
                    if(train_class=='2S')
                    { /*General */
                     incr = 60;
                     price = 70;
                    }
                    else if(train_class=='SL')
                    {
                     incr = 110;
                     price = 120;
                    }
                    else if(train_class=='CC')
                    {
                        incr = 120;
                        price = 130;
                    }
                    else if(train_class=='3E')
                    {
                        incr = 125;
                        price = 135;
                    }
                    else if(train_class=='3A')
                    {
                     incr = 130;
                     price = 140;
                    }
                     else if(train_class=='2A')
                     {
                     incr = 210;
                     price = 220;
                     }
                     else if(train_class=='EC')
                     {
                        incr = 230;
                        price = 240;
                     }
                     else if(train_class=='1A')
                     {
                     incr = 270;
                     price = 270;
                     }
                    for(let i = 60;i<=3000;i = i + 60)
                    {
                        if(distance<=i)
                        {
                            price = price;
                            break;
                        }
                        price = price + incr;;
                    }
                }

                price = x*price;   // price based on number of passengers
                arr.price = price;
                arr.no_of_seats = x;
                
                var d = new Date();
                let time = d.toString().slice(16,24);
                arr.booked_time = time;
                let subtime = d.toString().substring(16,24);
                let new_month = d.getMonth()+1;
                let date =   d.getFullYear()+'-'+new_month+'-'+ d.getDate();
                arr.booked_date = date;
                console.log(date + ' ' + time+' '+subtime);
                const id = Math.random().toString().slice(2,8);
                arr.ticket_id = id;
                const pnr = Math.random().toString().slice(2,12);
                arr.pnr = pnr;
                console.log(arr);
                let max_seats = 0;
                let seats = 0;
                let seats_available = false;


                /* new logic*/
                let no_of_passengers = x;
                
                let coach_no = 0;
                let confirmed_seats = 0;
                let max_confirmed_seats = 0;
               
                
                let wl_seats = 0;
                let max_wl_seats = 0;
                let no_of_coaches = 0;
                let coach_calculation = 0;
                let coach_code;
                let database_confirmed_max = 0;
                let passenger_key = train_id + '-'+train_class+'-'+dates;
                let cancelled_confirm_seats_array = [];
                console.log(app.locals.confirmed_seats_cancelled);
                    if(app.locals.confirmed_seats_cancelled[passenger_key])
                    {
                        console.log("entered")
                        cancelled_confirm_seats_array    =    app.locals.confirmed_seats_cancelled[passenger_key];
                        console.log(app.locals.confirmed_seats_cancelled.passenger_key);
                        console.log(app.locals.confirmed_seats_cancelled[passenger_key]);
                    }
                console.log('cancellled confirm seats array = ');
                console.log(cancelled_confirm_seats_array);
                // seat_no - confirmed tickets
                db.query(`SELECT count(status_num) as seat_no,max(status_num) as max_seat_no FROM trainreservation.passengers where ticket_status LIKE 'CNF%'AND tick_id in (select ticket_id from ticket where train_id='${train_id}' and class='${train_class}' and journey_date='${dates}');`)
                .then(([result,metadata]) => {
                    console.log(result);
                    if(result[0].seat_no == null)
                    {
                        seat_no = 0;
                        confirmed_seats = 0;
                        database_confirmed_max = 0;
                    }
                    else
                    {
                    seat_no = parseInt(result[0].seat_no);
                    confirmed_seats = seat_no;
                    database_confirmed_max = parseInt(result[0].max_seat_no);
                    }
                    
                    return db.query(`SELECT max(status_num) as wl_no FROM trainreservation.passengers where ticket_status LIKE 'WL%'AND tick_id in (select ticket_id from ticket where train_id='${train_id}' and class='${train_class}' and journey_date='${dates}');`)
                })
                // wl_no - Waitlisted tickets
                .then(([result,metadata]) => {
                    console.log(result);
                    if(result[0].wl_no == null)
                    {
                        wl_no = 0;
                        wl_seats = 0;
                    }
                    else
                    {
                    wl_no = parseInt(result[0].wl_no);
                    wl_seats = wl_no;
                    }
                    
                    return db.query(`select max_seats,wl_max, no_of_coaches from class_details where trains_id=${train_id}  AND class_id=(select id from class where class='${train_class}')`)
                
                })
                .then(([result,metadata]) => {
                    console.log(result);
                    coach_calculation = parseInt(result[0].max_seats);
                    max_confirmed_seats =  parseInt(result[0].max_seats)*parseInt(result[0].no_of_coaches);
                    
                   
                    max_wl_seats = parseInt(result[0].wl_max);
                    no_of_coaches = parseInt(result[0].no_of_coaches);
                    console.log(max_confirmed_seats,max_wl_seats);
                   
                    return db.query(`select class_code from class where class='${train_class}'`) 
                })
                .then(([result,metadata]) => {
                    console.log(result);
                    coach_code = result[0].class_code;
                    console.log('Hi bro ! Am i there');
                    console.log(max_confirmed_seats - confirmed_seats - no_of_passengers);
                    if(max_confirmed_seats- (confirmed_seats + cancelled_confirm_seats_array.length) - no_of_passengers < 0)
                    {
                        //   Confirmed and waiting
                        if(cancelled_confirm_seats_array.length>0)
                        {
                            if((max_confirmed_seats-confirmed_seats)>=x)
                            {
                            let local_array_length = cancelled_confirm_seats_array.length;
                            let count = 0;
                            let max_confirmed_seat_value = database_confirmed_max;
                            for(let i = 0;i<cancelled_confirm_seats_array.length;i++)
                            {
                                console.log('Entered midarray')
                                max_confirmed_seat_value = Math.max(max_confirmed_seat_value,cancelled_confirm_seats_array[i])
                            } 
                            console.log(max_confirmed_seat_value);
                            
                            for(let i = 0;(i<local_array_length);i++)
                            {
                              
                                console.log(seat_no);
                                seat_no = cancelled_confirm_seats_array.shift();
                                coach_no = Math.ceil(seat_no/ coach_calculation);
                                coach_no = coach_code + coach_no  ;
                                passenger[i].ticket_status = 'CNF'+ seat_no;
                                passenger[i].seat_no = seat_no;
                                passenger[i].coach_no = coach_no;
                                count++;
                       
                            }
                            console.log("count = "+count +" x = "+x);
                            if(count<x)
                            {
                                console.log("entered to increment");
                                while(count<x)
                                {
                                    seat_no = ++max_confirmed_seat_value;
                                    coach_no = Math.ceil(seat_no/ coach_calculation);
                                    coach_no = coach_code + coach_no;
                                    passenger[count].ticket_status = 'CNF'+ seat_no;
                                    passenger[count].seat_no = seat_no;
                                     passenger[count].coach_no = coach_no;
                                     count++;
                                }
                            }
                            }
                            else
                            {
                            
                                    
                                        // WL + Confirmed
                                        // A negative value is thrown
                            
                                        let diff = Math.abs(cancelled_confirm_seats_array.length - no_of_passengers);
                                        let max_confirmed_seat_value = database_confirmed_max;
                                        let mid_arr_length = cancelled_confirm_seats_array.length;
                                        for(let i = 0;i<cancelled_confirm_seats_array.length;i++)
                                        {
                                            console.log('Entered midarray')
                                            max_confirmed_seat_value = Math.max(max_confirmed_seat_value,cancelled_confirm_seats_array[i])
                                        }
                                        if(max_confirmed_seat_value<max_confirmed_seats)
                                        {
                                            console.log('entered comparison')
                                            seat_no = max_confirmed_seat_value;
                                            mid_arr_length = mid_arr_length+ max_confirmed_seats-max_confirmed_seat_value;
                                            diff = diff - (max_confirmed_seats-max_confirmed_seat_value);
                                        }
                                        for(let k = 0;k<mid_arr_length;k++)
                                        {
                                                // cnf tickets
                                                console.log(mid_arr_length);
                                                console.log('visited cancelled tickets');
                                                console.log(cancelled_confirm_seats_array);
                                                if(cancelled_confirm_seats_array.length>0)
                                                {
                                                seat_no = cancelled_confirm_seats_array.shift();
                                                }
                                                else
                                                {
                                                    seat_no = ++max_confirmed_seat_value;
                                                    
                                                }
                                                coach_no = Math.ceil(seat_no/ coach_calculation);
                                                coach_no = coach_code + coach_no;
                                                passenger[k].ticket_status = 'CNF'+ seat_no;
                                                passenger[k].seat_no = seat_no;
                                                passenger[k].coach_no = coach_no;
                                            
                                            
                                        }
                                        
                            
                                    for(let i = mid_arr_length;i<(diff +mid_arr_length);i++)
                                    {
                                        console.log('visited this now')
                                        wl_no++;
                                        passenger[i].ticket_status = 'WL'+ wl_no;
                                        passenger[i].seat_no = wl_no;
                                        passenger[i].coach_no = 0;
                                        passenger[i].wl_seat = true;
                                    }
                                   
                            }
                        }
                        else
                        {
                        if(wl_seats>0)
                        {
                            // only waiting list
                            if(max_wl_seats-wl_seats-no_of_passengers<0)
                            {
                                // notify that waiting list limit has reached
                                seats_available = false;
                                return res.status(200).render('error');

                                // only few tickets can be booked if there are more passengers
                            }
                            else
                            {
                                // only   waiting list
                                for(let i = 0;i<no_of_passengers;i++)
                                {
                                    wl_no++;
                                    passenger[i].ticket_status = 'WL'+ wl_no;
                                    passenger[i].seat_no = wl_no;
                                    passenger[i].coach_no = coach_no;
                                    passenger[i].wl_seat = true;
                                }
                            }
                        }
                        else
                        {
                            // WL + Confirmed
                            // A negative value is thrown
                            
                                let diff = Math.abs(max_confirmed_seats - confirmed_seats - no_of_passengers);
                                for(let k = diff;k<no_of_passengers;k++)
                                {
                                        // cnf tickets
                                        
                                        seat_no++;
                                        coach_no = Math.ceil(seat_no/ coach_calculation);
                                        coach_no = coach_code + coach_no;
                                        passenger[k].ticket_status = 'CNF'+ seat_no;
                                        passenger[k].seat_no = seat_no;
                                        passenger[k].coach_no = coach_no;
                                    
                                    
                                }
                            
                                for(let i = 0;i<diff;i++)
                                {
                                    wl_no++;
                                    passenger[i].ticket_status = 'WL'+ wl_no;
                                    passenger[i].seat_no = wl_no;
                                    passenger[i].coach_no = 0;
                                    passenger[i].wl_seat = true;
                                }
                        }   
                    }   
                    }
                    else
                    {
                        // only Confirmed seats
                        // All passenger status will be CNF
                        
                        if(app.locals.confirmed_seats_cancelled[passenger_key])
                        {
                        let confirmed_array_max = 0;
                        for(let i = 0;i<cancelled_confirm_seats_array.length;i++)
                        {
                            confirmed_array_max = Math.max(confirmed_array_max,cancelled_confirm_seats_array[i])
                        }
                        let seat_no_starting_value = Math.max(database_confirmed_max,confirmed_array_max);
                        seat_no = seat_no_starting_value;
                        }
                        
                        console.log('visited this only' + x)
                        for(let i = 0;i<x;i++)
                        {
                          
                            seat_no = seat_no + 1;
                            console.log(seat_no);
                            coach_no = Math.ceil(seat_no/ coach_calculation);
                            coach_no = coach_code + coach_no  ;
                            passenger[i].ticket_status = 'CNF'+ seat_no;
                            passenger[i].seat_no = seat_no;
                            passenger[i].coach_no = coach_no;
                       
                        }
                        
                        
                    }
                    return db.query(`insert into ticket values (${id},'${pnr}','${source}','${destination}','${time}','${date}',${distance},${user_id},${train_id},${price},'${train_class}',${x},'${dates}','${duration}','${departure_time}','${arrival_time}','${new_dates}');`)
                })
                .then(([result,metadata]) => {
                    console.log(passenger);
                let tick_id = 0;
                console.log('Success! Inserted into ticket table');
                console.log(result);
                tick_id = result;
                return result;
                })
                .then((results) => {
                console.log(results);
                console.log(passenger[0].name);
                // const psg_id_1 = Math.random().toString().slice(2,8);
                    
                    for(let i = 0;i<no_of_passengers;i++)
                    {
                    const psg_id_1 = Math.random().toString().slice(2,8);
                    db.query(`insert into passengers values(${psg_id_1},'${passenger[i].name}',${passenger[i].age},${results},'${passenger[i].gender}','${passenger[i].ticket_status}',${passenger[i].seat_no},'${passenger[i].coach_no}');`)
                    .then(([result,metadata]) => {
                        console.log(result);
                        
                        console.log('from passenger 1');
                        
                         
                        // return res.redirect('/pnr_status');

                    })
                }
                    for(let q = 0;q<arr.passenger.length;q++)
                    {
                        if (arr.passenger[q].ticket_status.toString().slice(0,3)=='CNF') 
                        {
                            arr.passenger[q].ticket_status = 'Confirmed';
                        }
                        else
                        {
                            arr.passenger[q].ticket_status = 'Waiting/'+arr.passenger[q].ticket_status;
                        }
                    }
                    res.render('view_ticket_details',{
                        arr : arr,
                        isLoggedIn : req.session.isLoggedIn,
                        user : req.session.user,
                        title : 'Ticket',
                        page : 'booking'
                    })
                })
                .catch(err => {
                    console.log(err);
                })
                

    }



exports.getTickets = (req,res,next) => {
    db.query('select * from ticket where user_id=1')
    .then(([result,metadata]) => {
        console.log(result);
        return res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postCheckPayment = (req,res,next) => {

const train_name = req.body.name;
const source=req.body.source;
const destination = req.body.destination;
const train_class = req.body.train_class;
const distance = req.body.distance;
const train_type = req.body.train_type;    
const train_id = req.body.train_id;
const dates = req.body.dates;
const arrival_time = req.body.arrival_time;
    const departure_time = req.body.departure_time;
    const duration = req.body.duration;
    const new_dates = req.body.new_dates;
let passenger= [];
let passenger_1 = {};
let passenger_2 = {};
let passenger_3 = {};
let passenger_4 = {};

passenger_1.name = req.body.passenger_name_1;
passenger_1.age = req.body.age_1;
passenger_1.gender = req.body.gender_1;
console.log(passenger_1);


passenger.push(passenger_1);

if(req.body.passenger_name_2 && req.body.age_2)
{

passenger_2.name = req.body.passenger_name_2;
passenger_2.age = req.body.age_2;
passenger_2.gender = req.body.gender_2;
console.log(passenger_2);
passenger.push(passenger_2);

}


if(req.body.passenger_name_3 && req.body.age_3)
{

passenger_3.name = req.body.passenger_name_3;
passenger_3.age = req.body.age_3;
passenger_3.gender = req.body.gender_3;
console.log(passenger_3);
passenger.push(passenger_3);

}

if(req.body.passenger_name_4 && req.body.age_4)
{

passenger_4.name = req.body.passenger_name_4;
passenger_4.age = req.body.age_4;
passenger_4.gender = req.body.gender_4;
console.log(passenger_4);
passenger.push(passenger_4);

}

console.log(passenger);

arr = {
    source : source,
    destination : destination,
    train_class : train_class,
    distance : distance,
    train_type : train_type,
    train_id : train_id ,
    dates :  dates ,
    passenger : passenger,
    train_name : train_name
}

arr.arrival_time = arrival_time;
    arr.departure_time = departure_time;
    arr.duration = duration;
    arr.new_dates = new_dates;

console.log(arr);

res.status(200).render('check_payment',{
    arr : arr,
    isLoggedIn : req.session.isLoggedIn,
    user : req.session.user,
    title : 'Review',
    page : 'booking'
})

}

