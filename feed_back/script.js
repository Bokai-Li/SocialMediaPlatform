$(async function() {
    const $btn = $('#submitbtn');
    $btn.click(async function(e) {
        e.preventDefault();
        let token = getUrlVars()["token"];
        let feedback = $('#feedback').serializeArray()[0].value;
        let token = response2.data.jwt;
        axiosInstance = axios.create({
            headers: { Authorization: `Bearer ${token}` },
            baseURL: `http://localhost:3000`
        });
        const response1 = await axiosInstance.get('/account/status', {});
        let username = response1.data.user.name;
        const response = await axiosInstance.post('/private/' + username + '/feedback', {
            data: feedback,
        });
        window.location.replace("../feedback/index.html?token=" + token)
    }
})

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}