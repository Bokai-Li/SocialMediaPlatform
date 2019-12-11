//Debounce function referenced from https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
 var timeout;
 return function() {
  var context = this, args = arguments;
  var later = function() {
   timeout = null;
   if (!immediate) func.apply(context, args);
  };
  var callNow = immediate && !timeout;
  clearTimeout(timeout);
  timeout = setTimeout(later, wait);
  if (callNow) func.apply(context, args);
 };
};
async function handleInput(e){
    $("#autocomplete").empty()
    const location = await axios({
        method: 'GET',
        url: 'http://localhost:3000/example/location',
    });
    var arr = location.data.message
    let val = e.target.value
    if(val!=""){
        for (i = 0; i < arr.length; i++) {
            if (arr[i].city.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                var firstpart = arr[i].city.substr(0, val.length)
                var lastpart = arr[i].city.substr(val.length)
                $("#autocomplete").append(`<div id="item${i}"><strong>${firstpart}</strong>${lastpart}</div>`)
                $(`#item${i}`).click(populateCityCountry)
            }
        }
    }
    $("#city").off('keydown');
    $("#city").keydown(handleKeydownAutocomplete);
}

function handleKeydownAutocomplete(e){
    var activeItem = $(".autocomplete-active").attr("id")
    var firstItem = $( "#autocomplete" ).children().first().attr("id")
    var lastItem = $( "#autocomplete" ).children().last().attr("id")
    if(activeItem==undefined){
        activeItem = 0
    }
    if (e.keyCode == 40) {//down
        if(activeItem!=lastItem){
            if(activeItem==0){
                $(`#${firstItem}`).addClass("autocomplete-active")
            }else{
                $(`#${activeItem}`).removeClass("autocomplete-active")
                $(`#${activeItem}`).next().addClass("autocomplete-active")
            }
        }
      } else if (e.keyCode == 38) {//up
        if(activeItem!=firstItem){
            $(`#${activeItem}`).removeClass("autocomplete-active")
            $(`#${activeItem}`).prev().addClass("autocomplete-active")
        }
      } else if (e.keyCode == 13) {
        e.preventDefault();
        $(`#${activeItem}`).click();
        
      }
}

async function populateCityCountry(e){
    var city = e.currentTarget.innerHTML
    city = city.replace("<strong>","")
    city = city.replace("</strong>","")
    $("#city").val(city)
    const location = await axios({
        method: 'GET',
        url: 'http://localhost:3000/example/location',
    });
    var arr = location.data.message
    let val = e.target.value
    var country
    if(val!=""){
        for (i = 0; i < arr.length; i++) {
            if (arr[i].city.toUpperCase() == city.toUpperCase()) {
                country=arr[i].country
            }
        }
    }
    $("#country").val(country)
    $("#autocomplete").empty()
}

$(async function() {
    const $btn = $('#submitbtn');
    const $message = $('#message');
    $('#city').bind("input",debounce(handleInput, 300));

    $btn.click(async function(e) {
        e.preventDefault();
        nameval = $('#username').serializeArray()[0].value;
        countryval = $('#country').serializeArray()[0].value;
        cityval = $('#city').serializeArray()[0].value;
        phoneNumberval = $('#phoneNumber').serializeArray()[0].value;
        emailval = $('#email').serializeArray()[0].value;
        passval = $('#password1').serializeArray()[0].value;
        passval2 = $('#password2').serializeArray()[0].value;
        cityvalencoded = cityval.replace(' ', '+')
        countryvalencoded = countryval.replace(' ', '+')
        if ($('#password1').val().length >= 8) {
            if (passval == passval2) {
                var googleUrl='https://maps.googleapis.com/maps/api/geocode/json?address='+cityvalencoded+',+'+countryvalencoded+'&key='+config.gmapKey
                const geo = await axios({
                    method: 'GET',
                    url: googleUrl
                });
                if(geo.data.status=="ZERO_RESULTS"){
                    document.getElementById("message").innerHTML = "Sorry! Location not found!";
                    return
                }
                const response = await axios({
                    method: 'POST',
                    url: 'http://localhost:3000/account/create',
                    data: {
                        "name": nameval,
                        "pass": passval,
                        "data": {
                            "country": countryval,
                            "city": cityval,
                            "phoneNumber": phoneNumberval,
                            "email": emailval,
                        }
                    }
                }).catch(()=>{
                    document.getElementById("message").innerHTML = "Sorry! The Username is already used!";
                });
                if (response.status == 200) {
                    const response2 = await axios({
                        method: 'POST',
                        url: 'http://localhost:3000/account/login',
                        data: {
                            "name": nameval,
                            "pass": passval,
                        }
                    })
                    let token = response2.data.jwt;
                    axiosInstance = axios.create({
                        headers: { Authorization: `Bearer ${token}` },
                        baseURL: `http://localhost:3000`
                    });
                    await axiosInstance.post('/private/' + nameval.toLowerCase() + '/location',{
                        data:{
                            "lat":geo.data.results[0].geometry.location.lat,
                            "lng":geo.data.results[0].geometry.location.lng,
                        }
                    });
                    await axiosInstance.post('/user/profile', {
                        data: {
                            "country": countryval,
                            "city": cityval,
                            "phoneNumber": phoneNumberval,
                            "email": emailval,
                        }
                    })
                    const response4 = await axiosInstance.post('/private/' + nameval.toLowerCase() + '/profile', {
                        data: {
                            "country": countryval,
                            "city": cityval,
                            "phoneNumber": phoneNumberval,
                            "email": emailval,
                        }
                    })
                    window.location.replace("../test_page/index.html?token=" + token)
                }
            } else {
                document.getElementById("message").innerHTML = "Sorry! Two passwords do not match!";
            }
        } else {
            document.getElementById("message").innerHTML = "Password needs to contain at least 8 characters!";
        }
    })
})