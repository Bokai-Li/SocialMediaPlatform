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
            const response2 = await axiosInstance.post('/private/' + nameval, {
                data: {
                    score: score,
                    closest10: closest
                }
            });
            console.log(response2)
            window.location.replace("/ball/index.html?token=" + token);
        }
    })
});

async function findClosest(token, nameval) {
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response1 = await axiosInstance.get('/private');
    const response3 = await axiosInstance.get('/private/' + nameval + '/score');
    let score = response3.data.result;
    let closest = new Array(10);
    let private_data = response1.data.result;
    let scores = new Array(private_data.length);
    for(let i = 0; i < private_data.length; i++) {
        const response2 = await axiosInstance.get('/private/' + private_data[i]);
        scores[i] = response2.data.result.score;
        private_data[i] = {username: private_data[i], score: scores[i]};
    }
    private_data.sort((a, b) => Math.abs(b.score-score)<Math.abs(a.score-score));
    let bound = (private_data.length < 11) ? private_data: 11;
    for(let i = 0; i < bound; i++) {
        closest[i] = private_data[i].username;
    }
    return closest;
}