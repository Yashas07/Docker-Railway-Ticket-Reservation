
 
document.querySelector('.loader').addEventListener("click",() => {
    console.log(Date.now().toString());
      document.querySelector('.loading-down').insertAdjacentHTML('afterend',`
      <div class="remove">
      <div class="d-flex justify-content-center color-picker">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
      </div>
      <br>
      </div>
      
      `)
  
      const new_time = setTimeout(() => {
        document.querySelector('.remove').remove();
      },2000);
      
      new_time();
  })
    

  $('input[name="date"]').datepicker({
    format: "dd-mm-yyyy",
    startDate: "+1d",
    endDate: '+121d',
    orientation: "right auto",
    autoclose: true,
    todayBtn: true,
    // daysOfWeekHighlighted: "0",
    todayHighlight: true
    // defaultViewDate: {  day: 15,month: 06, year: 2020 }
  });
  
document.querySelector('.swap-2').addEventListener("click",() => {
    let source = document.querySelector('#source').value;
    console.log(source);
    let destination = document.querySelector('#destination').value;
    console.log(destination);
    let temp = source;
    document.querySelector('#source').value = destination;
    document.querySelector('#destination').value = temp;
  })


