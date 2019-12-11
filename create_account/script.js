async function handleInput(e){
    console.log("hello")
    $("#autocomplete").empty()
    const location = await axios({
        method: 'GET',
        url: 'http://localhost:3000/example/location',
    });
    var arr = location.data.message
    let val = e.target.value
    for (i = 0; i < arr.length; i++) {
        if (arr[i].city.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            var firstpart = arr[i].city.substr(0, val.length)
            var lastpart = arr[i].city.substr(val.length)
          $("#autocomplete").append(`<div><strong>${firstpart}</strong>${lastpart}</div>`)
        }
      }
}

$(async function() {
    const $btn = $('#submitbtn');
    const $message = $('#message');
    $('#city').bind("input",handleInput);

    $btn.click(async function(e) {
        e.preventDefault();
        nameval = $('#username').serializeArray()[0].value;
        countryval = $('#country').serializeArray()[0].value;
        cityval = $('#city').serializeArray()[0].value;
        phoneNumberval = $('#phoneNumber').serializeArray()[0].value;
        emailval = $('#email').serializeArray()[0].value;
        passval = $('#password1').serializeArray()[0].value;
        passval2 = $('#password2').serializeArray()[0].value;

        if ($('#password1').val().length >= 8) {
            if (passval == passval2) {
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
                });
                console.log(response);
                const response2 = await axios({
                    method: 'POST',
                    url: 'http://localhost:3000/account/login',
                    data: {
                        "name": nameval,
                        "pass": passval,
                    }
                });
                if (response.status == 200) {
                    let token = response2.data.jwt;
                    axiosInstance = axios.create({
                        headers: { Authorization: `Bearer ${token}` },
                        baseURL: `http://localhost:3000`
                    });
                    const response3 = await axiosInstance.post('/user/profile', {
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
                document.getElementById("message").innerHTML = "Sorry! Two password input does not match!";
            }
        } else {
            document.getElementById("message").innerHTML = "Password need to contain at least 8 characters!";
        }
    })
})