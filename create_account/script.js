$(function() {
    const $form = $('#login-form');
    const $btn = $('#submitbtn')
    const $message = $('#message');
    $btn.click(async function(e){
        e.preventDefault()
        passval = $('#password1').serializeArray()[0].value
        nameval = $('#username').serializeArray()[0].value
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:3000/account/create',
            data: {
                "name": nameval,
                "pass": passval,
            }
        });
        console.log(response)
    })
  });