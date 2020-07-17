let seats;


const checkAvailability = (btn) => {
    let set = false;
    let train_class = btn.parentNode.parentNode.querySelector('select[name="new_train_class"]').value;
    console.log(btn.parentNode.parentNode.querySelector('select[name="new_train_class"]').value);
    let date = btn.parentNode.parentNode.querySelector('input[name="dates"]').value;
    console.log(date);
    let train_id = btn.parentNode.parentNode.querySelector('input[name="train_id"]').value;
    console.log(train_id);
    let distance = btn.parentNode.parentNode.querySelector('input[name="distance"]').value;
    console.log(distance);
    let train_type = btn.parentNode.parentNode.querySelector('input[name="train_type"]').value;
    console.log(train_type);

    fetch('/check_availability',{
        method : 'POST',
        headers : {
            "content-Type" : "application/json"
        },
        body : JSON.stringify({
            train_class : train_class,
            train_id : train_id,
            date : date,
            train_type  : train_type,
            distance : distance
        })
    })
    .then(result => {
        console.log(result);
        return result.json();
    })
    .then(res => {
        console.log(res);
        const btn1 = btn;
        seats = res.seats;
        console.log(seats);
        if(!set)
        {

            
            btn.parentNode.remove(btn);
            

            set = true;
            if(!(res.no_bookings))
            {
            document.querySelector(`.btn-reappear-${train_id}`).insertAdjacentHTML('beforeend',`
            <div class="remove-${train_id}" style="margin-left:50px">
            
            <button  type="submit" class="btn btn-success"><strong>Book Now</strong></button>
            <input type="hidden" name="fare" value="${res.fare}">
            </div>
            `)
            }

            document.querySelector(`.btn-reappear-${train_id}`).insertAdjacentHTML('afterend',`
            <div class="remove-${train_id}">
            
            <h4 style="text-align:center; color:black"> Ticket Status = ${res.ticket_status}</h4>
            <h4 style="text-align:center; color:black"> Fare = Rs.${res.fare}</h4>
            </div>
            `)
           
            
        }
        
        document.querySelector(`select[value="${train_id}"]`).addEventListener("click",() => {
            console.log(set);
            if(set)
            {
                console.log(set)
            set = false;
            document.querySelector(`.btn-reappear-${train_id}`).insertAdjacentHTML('beforeend',`
            
            <div class=" col-md-3">
                <button type="button" onclick="checkAvailability(this)" class="btn btn-success btn-size"><strong>Check Availability and fare</strong></button>
            </div>
            `)
        
            const store = document.getElementsByClassName(`remove-${train_id}`)
            while(store[0])
            {
                store[0].remove();
            }
            }
        })
        

    })
    .catch(err => {
        console.log(err);
    })
}

