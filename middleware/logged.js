module.exports = (req,res,next) => {

    if(!req.session.isLoggedIn)
    {
    //     if(req.body.set_value)
    //     {
    // const name = req.body.train_name;
    // const source = req.body.source;
    // const destination = req.body.destination;
    // const dates = req.body.dates;
    // const train_type = req.body.train_type;
    // const distance = req.body.distance;
    // const train_id = req.body.train_id;
    // let train_class = req.body.train_class;
    // const arrival_time = req.body.arrival_time;
    // const departure_time = req.body.departure_time;
    // const duration = req.body.duration;
    // const fare = req.body.fare;
    // const new_dates = req.body.new_dates;


    // arr = {

    // }
    
    
    // arr.name = name;
    // arr.source = source;
    // arr.destination = destination;
    // arr.dates = dates;
    // arr.train_type = train_type;
    // arr.distance = distance;
    // arr.train_id = train_id;
    // arr.train_class = train_class;
    
    // arr.arrival_time = arrival_time;
    // arr.departure_time = departure_time;
    // arr.duration = duration;
    // arr.fare = fare;
    // arr.new_dates = new_dates;
    // console.log(name);
    // console.log(source);
    // console.log(destination);
    // console.log(dates);
    // console.log(arr);

    // res.render('/login',{
    //     title : 'Login',
    //     page : 'login',
    //     errormessage : false,
    //     isLoggedIn : req.session.isLoggedIn,
    //     user : req.session.user,
    //     arr : arr
    // })
    // }
        return res.redirect('/login');
    }
   
    next();
}