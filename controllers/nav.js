const db = require('../util/database');

exports.getContact = (req,res,next) => {
    
    res.status(200).render('./nav/contact',{
        title : 'Contact',
        page : 'contact',
        isLoggedIn : req.session.isLoggedIn,
        user : req.session.user
    });
}

exports.getPnr_status = (req,res,next) => {
    res.status(200).render('./nav/pnr_status',{
        title : 'PNR Status',
        page : 'pnr_status',
        isLoggedIn : req.session.isLoggedIn,
        user : req.session.user,
        set : false,
        set1 : false
    });
}

exports.getDashBoard = (req,res,next) => {
    res.status(200).render('dashboard',{
        tickets : [],
        title  : 'DashBoard',
        page : 'dashboard',
        isLoggedIn : req.session.isLoggedIn,
        user : req.session.user,
        set : false,
        
    })
}

exports.postPnrStatus = (req,res,next) => {
    const pnr = req.body.pnr;
    let passengers ;
    console.log(pnr);
    db.query(`select * from ticket where pnr LIKE '${pnr}'`)
    .then(([result,metadata]) => {
        if(result.length==0)
        {
            console.log('Error !! Not a valid PNR');
            return Promise.reject('Not a valid PNR');
           
        }
        console.log(result);
        
        return db.query(`select * from passengers join ticket on tick_id=ticket_id and tick_id=${result[0].ticket_id}`)
    })
    .then(([result,metadata]) => {
        console.log(result);
        passengers = result;
         return db.query(`select arrival_time from train_stations where train_id=${passengers[0].train_id} and station_id=(select id from stations where Name='${passengers[0].destination}')`)
    })
    .then(([result,metadata]) => {
        console.log(result);
        passengers[0].arrival_time = result[0].arrival_time;
        return db.query(`select departure_time from train_stations where train_id=${passengers[0].train_id} and station_id=(select id from stations where Name='${passengers[0].source}')`)
    })
    .then(([result,metadata]) => {
        console.log(result);
        passengers[0].departure_time = result[0].departure_time;
        return db.query(`select Name from train where id=${passengers[0].train_id}`)
    })
    .then(([result,metadata]) => {
        console.log(result);
        passengers[0].train_name = result[0].Name;
        console.log(passengers);
        return res.render('./nav/pnr_status',{
            arr : passengers,
            pnr : pnr,
            isLoggedIn : req.session.isLoggedIn,
            user : req.session.user,
            page : 'pnr_status',
            title : 'PNR Status',
            set : true,
            set1 : true
        })
    })
    .catch((err) => {
        console.log(err);
       
        return res.render('./nav/pnr_status',{
            pnr : pnr,
            arr : [],
            set1 : true,
            title : 'PNR Status',
            page : 'pnr_status',
            isLoggedIn : req.session.isLoggedIn,
            user : req.session.user,
            set : false
        
        });
    })
    
}

