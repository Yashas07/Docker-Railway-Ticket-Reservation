const db = require('../util/database');
const { QueryTypes } = require('sequelize');

exports.getTrains = (req,res,next) => {
    let set = false;
    res.render('index',{
        set : set,
        title : 'Home',
        page : 'home',
        isLoggedIn : req.session.isLoggedIn,
        user : req.session.user
    });
}

exports.getBooking = (req,res,next) => {
    // if(req.session.isLoggedIn)
    // {

    // }
    res.render('trainlist',{
        set : false,
        page : 'booking',
        title : 'Search trains',
        isLoggedIn : req.session.isLoggedIn,
        user : req.session.user,
        is_maximum : false
    })
}
exports.bookTrains = (req,res,next) => {
    const name = req.body.train_name;
    const source = req.body.source;
    const destination = req.body.destination;
    const dates = req.body.dates;
    const train_type = req.body.train_type;
    const distance = req.body.distance;
    const train_id = req.body.train_id;
    let train_class = req.body.train_class;
    const arrival_time = req.body.arrival_time;
    const departure_time = req.body.departure_time;
    const duration = req.body.duration;
    const fare = req.body.fare;
    const new_dates = req.body.new_dates;
    const no_of_passengers = req.body.no_of_passengers;
    if(train_class=='All-Class')
    {
        train_class = req.body.new_train_class;
    }
    const seats = req.body.seats;
    arr = {

    }
    
    
    arr.name = name;
    arr.source = source;
    arr.destination = destination;
    arr.dates = dates;
    arr.train_type = train_type;
    arr.distance = distance;
    arr.train_id = train_id;
    arr.train_class = train_class;
    arr.seats = seats;
    arr.arrival_time = arrival_time;
    arr.departure_time = departure_time;
    arr.duration = duration;
    arr.fare = fare;
    arr.new_dates = new_dates;
    arr.no_of_passengers = no_of_passengers;
    console.log(name);
    console.log(source);
    console.log(destination);
    console.log(dates);
    console.log(arr);

    const d = new Date(Date.now());
    console.log(d.getMonth());
    const month = d.getMonth() + 1;
    console.log(month);
    db.query(`select count(ticket_id) as no_of_tickets from ticket where user_id=${req.session.user.id} and Date LIKE '%-${month}-%'`)
    .then(([result,metadata]) => {
        console.log(result);
        console.log(result[0].no_of_tickets);
        if(result[0].no_of_tickets>=6)
        {   console.log('maximum tickets booked for a month');
            return res.render('trainlist',{
                set : false,
                title : 'Search Trains',
                page : 'booking',
                isLoggedIn : req.session.isLoggedIn,
                user : req.session.user,
                is_maximum : true 
            })
        }
        res.render('booking',{
            arr : arr,
            title : 'Booking',
            page : 'booking',
            isLoggedIn : req.session.isLoggedIn,
            user : req.session.user,
            is_maximum : false
         });
    })
    .catch(err => {
        console.log(err);
    })
     
}

exports.postCheckAvailability = (req,res,next) => {
    let train_id = req.body.train_id;
    let train_class = req.body.train_class; //From jSon body
    let date = req.body.date;
    let train_type = req.body.train_type;
    let distance = req.body.distance;
    let seats_available = true;;
    let confirmed_seats = 0;
    
    let wl_seats = 0;
    let max_confirmed_seats = 0;
   
    let max_wl_seats = 0;
    let ticket_status;
    let visited_availability = true;
    console.log(train_class);
    console.log(train_id);
    console.log(date);
    let fare = 0;
    if(train_type=='Shatabdhi' || train_type=='Duronto' || train_type=='Rajdhani')
    {
        let incr = 100;
        if(train_class=='2S')
        { /*General */
         incr = 90;
         fare = 100;
        }
        else if(train_class=='SL')
        {
         incr = 140;
         fare = 150;
        }
        else if(train_class=='CC')
        {
            incr = 150;
            fare = 160;
        }
        else if(train_class=='3E')
        {
            incr = 155;
            fare = 165;
        }
        else if(train_class=='3A')
        {
         incr = 160;
         fare = 170;
        }
         else if(train_class=='2A')
         {
         incr = 240;
         fare = 250;
         }
         else if(train_class=='EC')
         {
            incr = 260;
            fare = 270;
         }
         else if(train_class=='1A')
         {
         incr = 290;
         fare = 300;
         }
        for(let i = 120;i<=3000;i = i + 120)
        {
            if(distance<=i)
            {
                fare = fare;
                break;
            }
            fare = fare + incr;;
        }
    }
    else if(train_type=='Super-fast')
    {
        let incr = 100;
        if(train_class=='2S')
        { /*General */
         incr = 70;
         fare = 80;
        }
        else if(train_class=='SL')
        {
         incr = 120;
         fare = 130;
        }
        else if(train_class=='CC')
        {
            incr = 130;
            fare = 140;
        }
        else if(train_class=='3E')
        {
            incr = 135;
            fare = 145;
        }
        else if(train_class=='3A')
        {
         incr = 140;
         fare = 150;
        }
         else if(train_class=='2A')
         {
         incr = 220;
         fare = 230;
         }
         else if(train_class=='EC')
         {
            incr = 240;
            fare = 250;
         }
         else if(train_class=='1A')
         {
         incr = 280;
         fare = 280;
         }
        for(let i = 80;i<=3000;i = i + 80)
        {
            if(distance<=i)
            {
                fare = fare;
                break;
            }
            fare = fare + incr;;
        }
    }
    else if(train_type=='Express' || train_type=='Intercity')
    {
        let incr = 100;
        if(train_class=='2S')
        { /*General */
         incr = 60;
         fare = 70;
        }
        else if(train_class=='SL')
        {
         incr = 110;
         fare = 120;
        }
        else if(train_class=='CC')
        {
            incr = 120;
            fare = 130;
        }
        else if(train_class=='3E')
        {
            incr = 125;
            fare = 135;
        }
        else if(train_class=='3A')
        {
         incr = 130;
         fare = 140;
        }
         else if(train_class=='2A')
         {
         incr = 210;
         fare = 220;
         }
         else if(train_class=='EC')
         {
            incr = 230;
            fare = 240;
         }
         else if(train_class=='1A')
         {
         incr = 270;
         fare = 270;
         }
        for(let i = 60;i<=3000;i = i + 60)
        {
            if(distance<=i)
            {
                fare = fare;
                break;
            }
            fare = fare + incr;
        }
    }

    
    let no_bookings = false;

     db.query(`SELECT count(status_num) AS confirmed_seats FROM passengers WHERE ticket_status LIKE 'CNF%' and tick_id in (select ticket_id from ticket where journey_date LIKE '${date}' AND class LIKE '${train_class}' AND train_id LIKE '${train_id}')`)
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
        //console.log(result[0].seats);
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

        if((confirmed_seats+wl_seats)>(max_confirmed_seats+max_wl_seats))
        {
            seats_available = false;
            ticket_status = 'Bookings are full for this class';
        }
        else
        {
            if(confirmed_seats>=max_confirmed_seats)
            {
                
                    if(wl_seats+4>=max_wl_seats)
                    {
                        seats_available = false;
                        ticket_status = 'Bookings are full for this class';
                        no_bookings = 'This-is-a-secret';
                    }
                    else
                    {
                        ticket_status = 'WL'+ wl_seats;
                    }
                
                
            }
            else
            {
                ticket_status = 'Available';
            }
        }


        res.status(200).json({
            message : 'Success',
            seats : seats_available,
            ticket_status : ticket_status,
            isLoggedIn : req.session.isLoggedIn,
            user : req.session.user,
            fare : fare,
            no_bookings : no_bookings
        })
    })
    .catch(err => {
        res.status(500).json({
            message : 'error'
        });
    })
    // res.redirect('/pnr_status');
}

exports.PostTrains = (req,res,next ) => {

console.log(req.body);
const train_class = req.body.train_class;
console.log(train_class);
const source= req.body.source;
console.log(source);
const destination = req.body.destination;
console.log(destination);
const dates = req.body.date;
console.log(dates);
const no_of_passengers = req.body.no_of_passengers;
console.log(no_of_passengers);

let source_id = 0;
let destination_id = 0;
if(source.toString().toUpperCase()===destination.toString().toUpperCase())
{
    console.log('source and destination cant be the same');
    return res.redirect('/');
}

const input_data = {
    source : source,
    destination : destination,
    dates : dates,
    train_class : train_class,
    no_of_passengers : no_of_passengers
}
let format_change = dates.toString().slice(6,10) + '-'+dates.toString().slice(3,5) +'-'+dates.toString().slice(0,2);
console.log(format_change);
const d = new Date(format_change);
console.log(d.getDay());

let arr1 = [];
let direction;
let arr2 = [];
let set = false;
let arr3 = [];
let new_arr = [];
let station_ids = [];


let first_then ;
let second_then;
let third_then;
let fourth_then;
db.query(`select id from stations where Name = '${source}'`)
.then(([id_source,extradata]) => {
    console.log(id_source);
    source_id = id_source[0].id;
})
.catch(err => {
    console.log(err);
})

db.query(`select id from stations where Name = '${destination}'`)
.then(([id_destination,extradata]) => {
    console.log(id_destination);
    destination_id = id_destination[0].id;
})
.catch(err => {
    console.log(err);
})
    db.query(`select * from train join train_stations on train.id=train_id and train_stations.station_id in (select id from stations where Name in ('${source}' , '${destination}'))`)
    .then (([result,metadata]) => {
        console.log(result);
        arr1 = result;
        for(let i = 0;i<result.length;i++)
        {
            console.log(result.length);
            for(let j = i+1;j<result.length;j++)
            {
                if(result[i].Name==result[j].Name)
                {
                    if(result[j].station_id==source_id)
                    {
                        result[j].distance = result[i].distance - result[j].distance;
                        console.log(result[j].distance)
                        
                        
                    }
                    else
                    {
                        result[j].distance = result[j].distance - result[i].distance; 
                        console.log(result[j].distance);
                       
                    }

                    if(result[j].distance>0)
                    {
                        // include the train
                        result[j].dir = 'R';
                        direction = 'R'

                    }
                    else
                    {

                        // dont include the train

                        result[j].dir = 'L';
                        direction = 'L';
                        arr1 = arr1.filter(cur => {
                            return cur.train_id != result[j].train_id
                        })
                    }
                    
                    //result[j].distance =  Math.abs(result[j].distance);
                    break;
                }
                
               
                
            }
        }
        // arr1 = result;
        //console.log(result);
        console.log(arr1);
        return db.query(`select * from stations`)
    })
      
        
    .then(result => {
        //     arr1 = result;
        console.log(result);
        for(let i = 0;i<arr1.length;i++)
        {
            for(let j = i+1;j<arr1.length;j++)
            {
                if(arr1[i].Name==arr1[j].Name)
                {
                    let availability;
                   for(let k = 1;k<=7;k++)
                   {
                        if(source_id==arr1[j].station_id)
                        {
                            availability = arr1[j].train_availability;
                        }
                        else
                        {
                            availability = arr1[i].train_availability;
                        }
                        if(availability.slice(k-1,k)==d.getDay().toString())
                        {
                        console.log('viisted');
                        
                        let duration_1 = arr1[i].duration.toString();
                        let duration_2 = arr1[j].duration.toString();
                        console.log('duration-1 : ' + duration_1);
                        console.log('duration-2 : ' +duration_2);
                        let hours = 0;
                        let minutes = 0;
                        
                        
                            if(source_id==arr1[j].station_id)
                            {
                                hours = duration_1.slice(0,2) - duration_2.slice(0,2);
                                minutes = duration_1.slice(3,5) - duration_2.slice(3,5);
                                if(minutes<0)
                                {
                                    minutes = 60 + minutes;
                                    hours = hours - 1;
                                }
                            }
                            else {
                                hours = duration_2.slice(0,2) - duration_1.slice(0,2);
                                minutes = duration_2.slice(3,5) - duration_1.slice(3,5);
                                if(minutes<0)
                                {
                                    minutes = 60 + minutes;
                                    hours = hours - 1;
                                }
                            }
                        
                        // hours = Math.abs(duration_1.slice(0,2) - duration_2.slice(0,2));
                        // minutes = Math.abs(duration_1.slice(3,5) - duration_2.slice(3,5));

                        let day = 0;
                        let mid_minutes = 0;
                        arr1[j].source = source;
                        arr1[j].destination = destination;
                        arr1[j].dates = dates;
                        arr1[j].train_class = train_class;
                        if(arr1[j].station_id == source_id)
                        {
                            //arr1[j].distance = arr1[i].distance - arr1[j].distance;
                            
                                if(source.toString().toUpperCase()!=arr1[j].Start_point.toString().toUpperCase())
                                {
                                    
                                    mid_minutes = parseInt(arr1[j].departure_time.toString().slice(3,5))-parseInt(arr1[j].arrival_time.toString().slice(3,5));

                                    console.log('mid-minutes = ' + mid_minutes);
                                }
                            
                            
                            
                            
                            if(mid_minutes<0)
                            {
                                mid_minutes = mid_minutes + 60;
                            }
                        arr1[j].departure_time = arr1[j].departure_time.toString().slice(0,5);
                        
                       // day = arr1[i].arrival_time.toString().slice(2,3);
                        arr1[j].arrival_time = arr1[i].arrival_time.toString().slice(0,5);
                        }
                        else{
                            //arr1[j].distance = arr1[j].distance - arr1[i].distance;
                           if(source.toString().toUpperCase()!=arr1[i].Start_point.toString().toUpperCase())
                                {
                                    
                                    mid_minutes = parseInt(arr1[i].departure_time.toString().slice(3,5))-parseInt(arr1[i].arrival_time.toString().slice(3,5));
                                    console.log('mid-minutes = ' + mid_minutes);
                                }
                            
                            
                            
                            if(mid_minutes<0)
                            {
                                mid_minutes = mid_minutes + 60;
                            }
                            arr1[j].departure_time = arr1[i].departure_time.toString().slice(0,5);
                            
                            //day = arr1[j].arrival_time.toString().slice(2,3);
                            arr1[j].arrival_time = arr1[j].arrival_time.toString().slice(0,5);
                        }
                        
                        minutes = minutes - mid_minutes;
                        if(minutes<0)
                        {
                            minutes = minutes + 60;
                            hours--;
                        }
                        
                        let depart_hours = parseInt(arr1[j].departure_time.toString().slice(0,2));
                        console.log('Depart hours = ' + depart_hours);
                        let total_hours = depart_hours + hours;
                        console.log('total hours = '+ total_hours);
                        while(total_hours>24)
                        {
                            day++;
                            total_hours = total_hours-24;

                        }
                        // let calc_day = day;
                        // while(calc_day>=1)
                        // {
                        //     if(hours)
                        //     hours = parseInt(hours) + 24;
                        //     calc_day--;
                        // }
                            //console.log(hours.toString().length);
                        if(hours.toString().length<2)
                        {
                            hours = '0'+hours;
                        }
                        if(minutes.toString().length<2)
                        {
                            minutes = '0'+minutes;
                        }
                        console.log('duration-hours = '+hours);
                        console.log('duration-minutes = ' + minutes);
                        let new_dates = day;
                        let sample = new Date(format_change);
                        let new_day = sample.getDate();
                        let month = sample.getMonth();
                        let year = sample.getFullYear();
                        if(day>0)
                        {
                            // let partial_date = dates.toString().slice(8,10);
                            // new_dates = parseInt(partial_date) + parseInt(new_dates);
                            new_dates = new_day + new_dates; 
                            if(month==1)
                            {
                                
                                if(year%4==0)
                                {
                                    if(new_dates>29)
                                    {
                                    new_dates = new_dates%29;
                                    month = month + 2;

                                    if(month>12)
                                    {
                                        month = month%12;
                                        year++;
                                    }
                                    }
                                    else
                                    {
                                        month++;
                                    }
    
                                   
                                }
                                else
                                {
                                    if(new_dates>28)
                                    {
                                    new_dates = new_dates%28;
                                    month = month + 2;

                                    if(month>12)
                                    {
                                        month = month%12;
                                        year++;
                                    }
                                    }
                                    else
                                    {
                                        month++;
                                    }
                                }
                                
                            }
                            else if(month == 0 || month == 2 || month==4 || month == 6 || month == 7 || month == 9 || month == 11)
                            {
                                if(new_dates>31)
                                {
                                new_dates = new_dates%31;
                                month = month + 2; //Since the return of the month is zero base in getMonth() method

                                if(month>12)
                                {
                                    month = month%12;
                                    year++;
                                }
                                }
                                else
                                {
                                    month++;
                                }
                            }
                            else if(month == 3 || month == 5 || month == 8 || month == 10)
                            {
                                if(new_dates>30)
                                {
                                new_dates = new_dates%30;
                                month = month + 2;

                                if(month>12)
                                {
                                    month = month%12;
                                    year++;
                                }
                                }
                                else
                                {
                                    month++;
                                }
                            }
                            if(new_dates.toString().length<2)
                            {
                                new_dates =  '0' + new_dates;
                            }
                            if(month.toString().length<2)
                            {
                                month = '0'+month;
                            }
                            
                            // new_dates = new_dates + '-'+month +'-' +  dates.toString().slice(0,4);
                            let new_words_dates = year +'-'+month +'-'+new_dates;
                            const new_words = new Date(new_words_dates);
                            let new_words_date = new_words.getDate() + ' ' + new_words.toString().slice(4,7);
                            console.log(new_words_date);
                            arr1[j].new_words_date = new_words_date;

                            new_dates = new_dates + '-'+month + '-'+ year;
                            arr1[j].new_dates = new_dates;
                            console.log(new_dates);
                            
                            
                        }
                        else {
                            
                            
                            //new_dates =  dates.toString().slice(8,10)+ '-'+ dates.toString().slice(5,7) +'-' +  dates.toString().slice(0,4);
                        new_words_date = d.getDate() + ' ' + d.toString().slice(4,7);
                        console.log(new_words_date);
                        arr1[j].new_words_date = new_words_date;
                            
                            new_dates = dates;
                            arr1[j].new_dates = dates;
                        }

                        

                        console.log('Days = ' + day);
                        arr1[j].duration = hours + ':'+ minutes;
                        set = true;
                        arr1[j].train_availability = availability;
                        console.log(arr1[j]);
                        arr2.push(arr1[j]);
                        break;
                        }
                   }
                        
                }
                
            }
           
        }
        console.log(arr2);
        // to maintain synchronous flow
       return db.query(`select * from class`)
    })
    .then(([result,metadata]) => {
            let maxseats = [];
            let seats = 0;
            for(let p = 0;p<arr2.length;p++)
            {
                db.query(`select class from class where id in (select class_id from class_details where trains_id=${arr2[p].train_id});`)
                .then(([result,metadata]) => {
                    console.log(result);
                    if(result)
                    {
                        for(let z = 0;z<result.length;z++)
                        {
                            if(result[z].class == '2S')
                            {
                                arr2[p].second_sitting = true;
                            }
                            else if(result[z].class == 'SL')
                            {
                                arr2[p].sleeper = true;
                            }
                            else if(result[z].class == 'CC')
                            {
                                arr2[p].ac_chair = true;
                            }
                            else if(result[z].class == '3E')
                            {
                                arr2[p].tier3_economy = true;
                            }
                            else if(result[z].class == '3A')
                            {
                                arr2[p].ac3_tier = true;
                            }
                            else if(result[z].class == '2A')
                            {
                                arr2[p].ac2_tier = true;
                            }
                            else if(result[z].class == 'EC')
                            {
                                arr2[p].tier1_economy = true;
                            }
                            else if(result[z].class == '1A')
                            {
                                arr2[p].ac1_tier = true;
                            }
                        }
                    }

                    if(p==arr2.length-1)
                    {
                        //to maintain synchronous flow
                        return db.query(`select * from class`)
                    }
                })
            }

            arr3  = arr2;
            if(arr2.length==0)
            {
                //to maintain synchronous flow
                
            }
            console.log(arr3);
            return db.query(`select * from class`)
           
        })
        .then(([result,metadata]) => {
            console.log(result);
            if(arr2.length>0 && train_class!='All-Class')
            {
            for(let j = 0;j<arr2.length;j++) {
                db.query(`select *  from class_details where trains_id=${arr2[j].train_id} and class_id=(select id from class where class='${train_class}')`)
                .then(([result,metadata]) => {
                    console.log(result);
                    if(result.length==0)
                    {
                        arr3 = arr3.filter(cur => {
                            return cur.Name != arr2[j].Name;
                        })
                        console.log('popped');
                    }
                    
                    if(j==arr2.length-1)
                    {
                        console.log('This is arrray 2 i.e before popping')
                        console.log(arr2);
                        console.log('entered into classes to check whether seats are available are not');
                        res.render('trainlist',{
                            arr : arr3,
                            set : set,
                            input_data : input_data,
                            title : 'Search trains',
                            page : 'booking',
                            isLoggedIn : req.session.isLoggedIn,
                            user : req.session.user,
                            is_maximum : false
                        })
                    }
                    
                })
                .catch(err => {
                    console.log(err);
                })
            }

            }
       
       else 
       {
           console.log('hi bro am i there')
           console.log(arr2);
           if(arr2.length<=0)
           {
              set = true;
           }
           res.render('trainlist',{
               arr : arr2,
               set : set,
               input_data : input_data,
               title : 'Search Trains',
               page : 'booking',
               isLoggedIn : req.session.isLoggedIn,
                user : req.session.user,
                is_maximum : false
           })
        }
        })
    
    .catch(err => {
        console.log(err);
    })

    
}
