const db = require('../util/database');

exports.getTrainSchedule = (req,res,next) => {
    
            res.render('stations',{
                arr : [],
                isLoggedIn : req.session.isLoggedIn,
                user : req.session.user,
                page : 'train-schedule',
                title : 'Train Schedule',
                set : false
            });
    
}

exports.postTrainSchedule = (req,res,next) => {
    const train_id = req.body.train_id;
    console.log(train_id);
    let arr;
    let train_details;
    db.query(`select * from train where id=${train_id}`)
    .then(([result,metadata]) => {
        train_details = result;
        return db.query(`select * from stations join train_stations on stations.id=station_id and train_id=${train_id}`)
    })
    .then(([results,metadata]) => {
            console.log(results);
            arr = results;
            arr.sort((a,b) => {
                return a.distance - b.distance;
            })
            console.log(arr);
            let dep_time;
            let dur;
            for(let i = 0;i<arr.length;i++)
            {
                dep_time = parseInt(arr[0].departure_time.toString().slice(0,2));
                dur = parseInt(arr[i].duration.toString().slice(0,2));
                let combine = dep_time + dur;
                if(combine>=0 && combine<24)
                {
                    arr[i].day = 1;
                }
                else if(combine>=24 && combine<48)
                {
                    arr[i].day = 2;
                }
                else if(combine>=48 && combine<72)
                {
                    arr[i].day = 3;
                }
                else if(combine>=72 && combine<96)
                {
                    arr[i].day = 4;
                }
            }
            arr[0].arrival_time = '------';
            arr[0].duration = '-------';
            arr[arr.length-1].departure_time = '------';
           res.render('stations',{
               isLoggedIn : req.session.isLoggedIn,
               user : req.session.user,
               page : 'train-schedule',
               title : 'Train Schedule',
               arr : arr,
               train_details : train_details,
               set : true
           })
        })
        .catch(err => {
            console.log(err);
        })
}