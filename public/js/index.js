const plus = document.querySelector('.add-passenger');


let header = document.getElementById('demo');;
let distance = document.querySelector('.distance').value;
let train_type = document.querySelector('.train_type').value;
let train_class = document.querySelector('.train_class').value;
let seats_booked = document.querySelector('.seats_booked').value;
var price = parseInt(document.querySelector('.price').textContent);
let no_of_passengers = parseInt(document.querySelector('input[name="no_of_passengers"]').value);
console.log(no_of_passengers);
if(!no_of_passengers)
{
    no_of_passengers = 4;
}
if(!(seats_booked))
{
    seats_booked = 0;
}
console.log(distance);
console.log(train_class);
console.log(train_type);
console.log(seats_booked);



var arr = [2,3,4];
let saved = 0;
let plus_button = 0;
//console.log(arr.pop())
var set_1 = false,set_2 = false,set_3 = false,set_4 = false;
var i = 2;
// var price = 0;
var initial_price = 0;
plus.addEventListener("click",() => {
    
    // if(!document.querySelector('.calculate_price').classList.contains('done'))
    // {
    //     console.log('Not pressed save yet');
    //     return;
    // }
    //console.log(!(plus_button<saved));
   
    if(arr.length<=(4-no_of_passengers))
    {
       confirm('Maximum limit of passengers reached for a ticket');
       return;
    }
    if(!(plus_button<saved))
    {
        console.log('Condition not met!!!');
        return;
    }
    seats_booked++;
    if(parseInt(seats_booked)>=70)
    {
        console.log(seats_booked);
        confirm('Tickets sold out ! Try different class');
        return;
    }
    
    console.log(plus_button);
    console.log(saved);
    plus_button++;
    
    i = arr.pop();
    console.log(document.querySelector('.add-passenger').innerHTML);
    document.querySelector('.add-passenger').insertAdjacentHTML('beforebegin',`
    
    <div class="js_${i} custom-border">
        
        <div class="form-row">
            <div class="col-md-6">
                <label for="passenger_name_${i}">Name </label>
                <input type="text" class="form-control" name="passenger_name_${i}" id="passenger_name_${i}" autocomplete="off">
            </div>
            <div class="col-md-2">
                <label for="age_${i}">Age</label>
                <input type="number"  class="form-control" name="age_${i}" id="age_${i}">
            </div>
            <div class="col-md-3">
                <label for="gender_${i}">Gender</label>
                <select class="custom-select"  name="gender_${i}" id="gender_${i}">
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Others</option>
                </select>
            </div>
            <img  class="img_${i} cancel" src="/img/button.png" alt="cancel">
        </div>
        <br>
        <input type="hidden" name="num" value="${i}">
        <div class="form-row">
            <div class="col-md-6">
                <input type="button" class="btn btn-success calculate_price_${i}" value="Save">
            </div>
        </div>
        
    </div>
`)
    
    //sessionStorage.headerHTML = header.outerHTML;
    const cancel2 = document.querySelector(`.img_${i}`);
    const cprice = document.querySelector(`.calculate_price_${i}`);
    const val = i;
    if(cancel2)
    {
    console.log(cancel2);

    cancel2.addEventListener("click",() => {
        
        const set = document.querySelector(`.calculate_price_${val}`).classList.contains('done');
        console.log(set);

        document.querySelector(`.js_${val}`).parentNode.removeChild(document.querySelector(`.js_${val}`));
        arr.push(val);
        
        
        plus_button--;
        if(set)
        {
        
        saved--;
        price = price-initial_price;
        document.querySelector('.price').textContent = price;
        }
    })


    cprice.addEventListener("click",() => {

        if(cprice.classList.contains('done'))
        {
            console.log(cprice.classList.length);
            return;
        }
                    console.log(price);
                    saved++;
                    cprice.classList.add('done');
                    price += initial_price;
                    document.querySelector('.price').textContent = price;
    
    })

    }
    
    

})


const cprice = document.querySelector('.calculate_price');


cprice.addEventListener("click",() => {

    if(cprice.classList.contains('done'))
        {
            console.log(cprice.classList.length);
            return;
        }
    
   
                set_1 = true;
    
   
               price = parseInt(document.querySelector('input[name="fare"]').value);

                console.log(price);

                initial_price = price;
                // document.querySelector('#class').setAttributeNode(document.createAttribute('disabled'));
                document.querySelector('.price').textContent = price;

                // document.querySelector('.disable_remove').addEventListener("click",() => {
                //     document.querySelector('#class').removeAttribute('disabled');
                // })

                saved++;

                

                cprice.classList.add('done');


})
//console.log(i);

document.querySelector('.price').textContent = price;

// document.querySelector('.disable_remove').addEventListener(() => {
//     document.querySelector('#class').removeAttribute('disabled');
// })

document.querySelector('.disable_remove').addEventListener("click",() => {
    document.querySelector('.train_name').removeAttribute('disabled');
    document.querySelector('.source').removeAttribute('disabled');
    document.querySelector('.destination').removeAttribute('disabled');
    document.querySelector('.dates').removeAttribute('disabled');
    document.querySelector('.custom-select').removeAttribute('disabled');
    console.log('hi bro');
})


// if(sessionStorage.headerHTML)
// {
//     header.outerHTML = sessionStorage.headerHTML;
// }

// const fun = setTimeout(() => {
//     sessionStorage.clear();
// },30000);