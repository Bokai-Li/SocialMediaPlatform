$(function() {
    const $btn = $('#submitbtn');
    const $message = $('#message');
    $btn.click(async function(e) {
        e.preventDefault();
        nameval = $('#username').serializeArray()[0].value;
        countryval = $('#country').serializeArray()[0].value;
        cityval = $('#city').serializeArray()[0].value;
        phoneNumberval = $('#phoneNumber').serializeArray()[0].value;
        emailval = $('#email').serializeArray()[0].value;
        passval = $('#password1').serializeArray()[0].value;
        passval2 = $('#password2').serializeArray()[0].value;

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
        }

        document.getElementById("message").innerHTML = "Sorry! Two password input does not match!";


    })

})