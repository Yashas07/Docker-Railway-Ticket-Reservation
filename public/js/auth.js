$('input[name="dob"]').datepicker({
    format: "dd-mm-yyyy",
    endDate : "-6574d",
    orientation: "bottom auto",
    autoclose: true,
    todayBtn: true,
    // daysOfWeekHighlighted: "0",
    todayHighlight: true
    // defaultViewDate: {  day: 15,month: 06, year: 2020 }
  });

  
  let tickets_opened = {};
  
  const viewDetails = (btn) => {
    let passenger_details_checked;
    
    const ticket_id = btn.parentNode.parentNode.parentNode.querySelector('input[name="ticket_id"]').value;
    console.log(ticket_id);


    fetch('/view_details',{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        ticket_id : ticket_id
      })
    })
    .then(result => {
      console.log(result);
      return result.json();
    })
    .then(passenger_details => {
      passenger_details_checked = passenger_details.passengers;
      console.log(passenger_details);
      console.log(btn.parentNode.parentNode.parentNode.parentNode.innerHTML.includes(`remove-${ticket_id}`));
      console.log(tickets_opened);
      if(!(btn.parentNode.parentNode.parentNode.parentNode.innerHTML.includes(`remove-${ticket_id}`)))
        {
          // btn.parentNode.remove(btn);
          tickets_opened[ticket_id] = passenger_details_checked;
          
          document.querySelector(`.btn-reappear-${ticket_id}`).insertAdjacentHTML('afterend',
          
          `
        
      <div class="remove-${ticket_id}">
        <table class="table">
        <thead class="thead-dark">
          <tr>
          <th scope="col">Select</th>
            
            <th scope="col">Name</th>
            <th scope="col">Gender</th>
            <th scope="col">Age</th>
            <th scope="col">Ticket Status</th>
            <th scope="col">Seat No.</th>
            <th scope="col">Coach No.</th>
          </tr>
        </thead>
        <tbody class="insert-${ticket_id}">
        </tbody>
        </table>
        </div>
     
        
        `)


          for(let i = 0;i<passenger_details.passengers.length;i++) {
          document.querySelector(`.insert-${ticket_id}`).insertAdjacentHTML('afterbegin',
          
            `
          
          
            <tr class="delete-${passenger_details.passengers[i].id}">
              <td>
              <div class="input-group mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <input type="checkbox" aria-label="Checkbox for following text input" id="${passenger_details.passengers[i].id}">
                </div>
              </div>
            </div>
              </td>
              
              <td class="td-success">${passenger_details.passengers[i].name}</td>
              <td>${passenger_details.passengers[i].gender}</td>
              <td>${passenger_details.passengers[i].age}</td>
              <td>${passenger_details.passengers[i].ticket_status.toString().slice(0,2)=='WL' ? 'WL'+passenger_details.passengers[i].status_num : passenger_details.passengers[i].ticket_status}</td>
              <td>${passenger_details.passengers[i].ticket_status.toString().slice(0,2)=='WL' ? '-------' : passenger_details.passengers[i].status_num}</td>
              <td>${passenger_details.passengers[i].ticket_status.toString().slice(0,2)=='WL' ? '-------' : passenger_details.passengers[i].coach_no}</td>
            </tr>
            
       
          
          `)
        }


        document.querySelector(`.remove-${ticket_id}`).insertAdjacentHTML('afterend',`
        
        <div class="remove-${ticket_id} col-md-2">
          <button style="margin-bottom:5px;" type="button" onclick="deleteTicket(this)" class="btn btn-danger loader btn-lg">Cancel</button>
        </div>
        
        `)
     
        }
        else
        {
          delete tickets_opened[ticket_id];
          const store = document.getElementsByClassName(`remove-${ticket_id}`)
            while(store[0])
            {
                store[0].remove();
            }
            
        }
    })
    .catch(err => {
      console.log(err);
    })
  }


  const deleteTicket = (btn) => {
    const ticket_id = btn.parentNode.parentNode.querySelector('input[name="ticket_id"]').value;
    console.log(ticket_id);
    console.log(tickets_opened);
    let passenger_details_checked;
    if(ticket_id in tickets_opened)
    {
      passenger_details_checked = tickets_opened[ticket_id];
      console.log(passenger_details_checked);
    }

    let arr = [];
    let updatedSeats,updatedPrice;
    let local_passenger_details_checked = passenger_details_checked;
    for(let i = 0;i<passenger_details_checked.length;i++)
    {
      // btn.parentNode.parentNode.getElementById(`${passenger_details_checked[i].id}`)
        if(document.getElementById(`${passenger_details_checked[i].id}`).checked)
        {
          arr.push(passenger_details_checked[i].id);
        }
    }

    updatedSeats = passenger_details_checked.length - arr.length;
    if(arr.length<=0)
    {
      return;
    }
    console.log(arr);
    fetch('/deleteTicket',{
      method : 'POST',
      headers : {
        'content-Type' : 'application/json'
      },
      body : JSON.stringify({
        ticket_id : ticket_id,
        passengers_to_be_deleted : arr,
        total_passengers_length : passenger_details_checked.length
      })
    })
    .then(result => {
      console.log(result)
      return result.json();
    })
    .then(deletedTickets => {
      console.log(deletedTickets);
      updatedPrice = deletedTickets.updatedPrice;
      const parentClass = btn.parentNode.parentNode.parentNode;

      // document.querySelector('.change-background').classList.add('bg-secondary');
      
      // btn.parentNode.parentNode.parentNode.parentNode.insertAdjacentHTML('afterbegin',`
      // <h1 style="color : red; position : absolute; left : 10%; ">Ticket Cancelled</h1>
      
      // `)
      btn.parentNode.parentNode.querySelector('#seats').textContent = updatedSeats;
      btn.parentNode.parentNode.querySelector('#updated-price').textContent = `Rs.${updatedPrice}` ;
      if(arr.length==passenger_details_checked.length)
      {
        btn.parentNode.parentNode.querySelector(`input[value="${ticket_id}"]`).parentNode.parentNode.remove();
      }
      else
      {
      for(let i  =0;i<arr.length;i++)
      {
        document.querySelector(`.delete-${arr[i]}`).remove();
      }
      passenger_details_checked = passenger_details_checked.filter(cur => {


        
        for(let i  =0;i<arr.length;i++)
        {
         if(cur.id== arr[i])
         {
           
           return;
         }
        }
        return cur;
        
      })
    }
      console.log(passenger_details_checked);
      tickets_opened[ticket_id] = passenger_details_checked;
      //btn.parentNode.remove();
      console.log(parentClass)
      if(!(parentClass.innerHTML.includes('display-border')))
      {
        parentClass.insertAdjacentHTML('afterend',`
        <div class="container">
            <h2>No tickets booked</h2>
        </div>
        `)
        parentClass.remove();
        
      }
      
    })
  }


  document.querySelectorAll('.loader').forEach(item => { 
    item.addEventListener("click",() => {
    document.querySelector('.loading-down').insertAdjacentHTML('afterend',`
      <div class="remove" style="postion:absolute; z-index: 100000">
      <div class="d-flex justify-content-center color-picker">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
      </div>
      <br>
      </div>

      
      
      `)

      
      const new_time = setTimeout(() => {
        // document.querySelector('.change-background').classList.remove('bg-secondary');
        const remove_loader = document.getElementsByClassName('remove');
        while(remove_loader[0])
        {
          remove_loader[0].remove();
        }
        
      },500);
      // add bootstrap spinners
      
      
  })
})


const fade_away = setTimeout(() => {
  document.querySelector('.fade-away').remove();
},3000);

fade_away();



