async function postFeedback(){ 
    axiosInstance = axios.create({
        headers: { Authorization: `` },
        baseURL: `http://localhost:3000`
    });

    const response = await axiosInstance.post('/public/feedback', {
        data: {
            "advice": $('.textarea').val()   
        }   
    });
}

async function view(){
    $('#submit').click(postFeedback);
}

view();