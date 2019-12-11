$(function () {
    const $form = $('#login-form');
    const $btn = $('#submitbtn')
    const $message = $('#message');
    $btn.click(async function (e) {
        e.preventDefault()
        passval = $('#password').serializeArray()[0].value
        nameval = $('#username').serializeArray()[0].value
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:3000/account/login',
            data: {
                "name": nameval,
                "pass": passval,
            }
        });
        let token = response.data.jwt;
        if (response.status == 200) {
            let closest = await findClosest(token, nameval);
            axiosInstance = axios.create({
                headers: { Authorization: `Bearer ${token}` },
                baseURL: `http://localhost:3000`
            });

            const response3 = await axiosInstance.get('/private/' + nameval + '/score');
            let score = response3.data.result;
            const response2 = await axiosInstance.post('/private/' + nameval + '/closest10', {
                data: closest
            });
            console.log(response2)
            window.location.replace("/ball/index.html?token=" + token);
        }
    })
});

async function findClosest(token) {
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response3 = await axiosInstance.get('/private/' + nameval + '/score');
    let score = response3.data.result;
    const response1 = await axiosInstance.get('/private');
    let private_data = response1.data.result;
    let scores = new Array(private_data.length);
    for(let i = 0; i < private_data.length; i++) {
        let deviation = 0;
        const response2 = await axiosInstance.get('/private/' + private_data[i]);
        console.log(response2)
        for(let j = 0; j < 20; j++) {
            scores[j] = response2.data.result.score[j];
            deviation = Math.abs(scores[j] - score[j]);
        }
        private_data[i] = {username: private_data[i], deviation: deviation};
    }
    private_data.sort((a, b) => b.deviation<a.deviation);
    let bound = (private_data.length < 11) ? private_data.length: 11;
    let closest = new Array(bound);
    for(let i = 0; i < bound; i++) {
        closest[i] = private_data[i].username;
    }
    return closest;
}