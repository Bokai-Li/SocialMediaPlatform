function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
let token = getUrlVars()["token"];
let username;
let currentuser = getUrlVars()["username"];



async function getUsername(){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response1 = await axiosInstance.get('/account/status', {});
    return response1.data.user.name;
}

const handleNewButtonPress = function(event) {
    $(`<textarea id="writenew" class="textarea" maxlength="280" placeholder="Create your new tweet here (max 280 characters)"></textarea>
       <button id="newpost" class="button is-danger">
            <i class="fas fa-blog"></i> Post
        </button>
       <button id="cancelpost" class="button is-warning cancel">Cancel</button>
       `).appendTo(".new");
    $('#newpost').on('click', handlePostPress);
    $('#cancelpost').on('click', function(){
        $('.new').empty();
    })
};

const handlePostPress = function(event){
    postTweets();
}

const renderTweet = function(tweet, id) {
    return `
        
    <div class="card" id ="${id}">
        <div class="card-content">
            <div class="content">
                <img class="headimg" src="wyb.JPG" alt="myimage">
                &nbsp;&nbsp;
                <span class="author">
                    ${tweet.author}
                </span>  
                <p>${tweet.body}</p>
            </div>

            <div class="content has-text-left">
                @Shanghai-Xuhui
                <br>
                ${tweet.createdAt}
            </div>
    
            <div class="content with-border" >
                    <div class="columns" id="button">
                            <div class="column is-6">
                                <button class="like three-button " id="like${id}">
                                    <i class="fas fa-thumbs-up"></i> Like <span id="likecount${id}">(${tweet.likeCount})</span>
                                </button>
                            </div>
                            <div class="column is-6">
                                <button class="three-button" id="reply${id}">
                                    <i class="fas fa-comment-dots"></i> Reply
                                </button>
                            </div>
                    </div>
            </div>
            


            <div class="content replyblockbefore" id="replycontent${id}">

            </div>
        </div>
    </div>
    `;
};

const renderMyTweet = function(tweet, id){
    return `
     
    <div class="card" id ="${id}">
        <div class="card-content">
            <div class="content">
                <img class="headimg" src="wyb.JPG" alt="myimage">
                &nbsp;&nbsp;
                <span class="author">
                    ${tweet.author}
                </span>  
                <p>${tweet.body}</p>
            </div>

            <div class="content has-text-left">
                @Shanghai-Xuhui
                <br>
                ${tweet.createdAt}
            </div>

            <div class="content with-border" >
                    <div class="columns" id="button">
                            <div class="column is-3">
                                <button class="like three-button " id="like${id}">
                                    <i class="fas fa-thumbs-up"></i> Like <span id="likecount${id}">(${tweet.likeCount})</span>
                                </button>
                            </div>
                            <div class="column is-3">
                                <button class="three-button" id="reply${id}">
                                    <i class="fas fa-comment-dots"></i> Reply 
                                </button>
                            </div>
                            <div class="column is-3">
                                <button class="three-button" id="edit${id}">
                                    <i class="fas fa-user-edit"></i> Edit
                                </button>
                            </div>
                            <div class="column is-3">
                                <button class="three-button" id="delete${id}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>

                    </div>
            </div>

            <div class="content replyblockbefore" id="replycontent${id}">

            </div>
        </div>
    </div>
`; 
}

async function readTweets(id){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.get('/private/' + currentuser + `/tweet/${id}`, {});
    return response.data.result;
}

async function postTweets(){ 
    // const userInfo = await axiosInstance.get('/private/' + currentuser);
    // let UserKeys = Object.keys(userInfo.data.result);
    // let haveTweet = false
    // for (let i=0; i < UserKeys.length; i++){
    //     if (UserKeys[i] == "tweet"){
    //         haveTweet = true;
    //     }
    // }
    // if (!haveTweet){
    //     const response = await axiosInstance.post('/private/' + currentuser, {
    //         data: {     
    //             "tweet": {},

    //         }   
    //     });  
    // }

    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    let curr_tweet = await getMyTweets();
    let id = Object.keys(curr_tweet).length;
    const response = await axiosInstance.post('/private/' + username + '/tweet/' + id, {
        data: {
           
                "type": "tweet",
                "author": username,
                "body": $("#writenew").val(),
                "isMine": true,
                "isLiked": new Array(0),
                "replyCount":0,
                "isLiked": new Array(0),
                'likeCount':0,
                "replies": [],
                "createdAt": Date.now(),
                //"updatedAt": Date.now(),
            
        }   
    });  
    location.reload()
}

async function reply(id){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.get('/private/' + currentuser + `/tweet/${id}`, {});
    let temp = response.data.result;
    //deleteTweets(id);
    temp.replies.push({
        "author": username,
        "parent": id,
        "body": $("#readyreply").val(),
    });
    temp.replyCount += 1;
    //$(`#replycount${id}`).html(`(${temp.replyCount})`);
    const response1 = await axiosInstance.post('/private/' + currentuser + '/tweet/' + id, {
        data: {
            "type": temp.type,
            "author": temp.author,
            "body": temp.body,
            "isMine": true,
            "isLiked": temp.isLiked,
            "replyCount":temp.replyCount,
            "likeCount": temp.likeCount,
            "replies": temp.replies,
            "createdAt": temp.createdAt,
            "updatedAt": temp.updatedAt,
        }   
    });
}


async function deleteTweets(id){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.delete('/private/' + currentuser + `/tweet/${id}`, {});
}

async function getTweets(){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const userInfo = await axiosInstance.get('/private/' + currentuser);
    let UserKeys = Object.keys(userInfo.data.result);
    let haveTweet = false
    for (let i=0; i < UserKeys.length; i++){
        if (UserKeys[i] == "tweet"){
            haveTweet = true;
        }
    }

    let response;
    if (haveTweet){
    response = await axiosInstance.get('/private/' + currentuser + '/tweet');
    }
    else{
        return null;
    }
    return response.data.result;
}

async function getMyTweets(){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.get('/private/' + username + '/tweet');
    return response.data.result;
}

async function updateTweets(id){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.get('/private/' + currentuser + `/tweet/${id}`, {});
    let temp = response.data.result;
    temp.body = $("#underedit").val();
    const response1 = await axiosInstance.post('/private/' + currentuser + '/tweet/' + id, {
        data: {
            "type": temp.type,
            "author": temp.author,
            "body": temp.body,
            "isMine": true,
            "isLiked": temp.isLiked,
            "replyCount":temp.replyCount,
            "likeCount": temp.likeCount,
            "replies": temp.replies,
            "createdAt": temp.createdAt,
            "updatedAt": temp.updatedAt,
        }   
    });
}

async function view() {
    username = await getUsername();
    if(typeof currentuser == "undefined"){
        currentuser = username;
    }

    $('#gohome').attr("href", `/home/index.html?token=${token}&username=${username}`);
    $('#goearth').attr("href", `/ball/index.html?token=${token}`);
    $('#goprofile').attr("href", `/profile/index.html?token=${token}&username=${username}`);
    
    let $root = $(".tweets");
    let tweets = await getTweets();
    if (tweets == null){
        $(".tweets").append(`<p style="font-size:30px;">Nothing here yet.</p>`);

        let friends = await findTenFriends();
        for(let i = 0; i < friends.length; i++){
            let url = "../home/index.html?token=" + token + "&username=" + friends[i]
            let bar = `<a href=${url} class="panel-block is-active">
                            <span class="panel-icon">
                            <i class="fas fa-people-carry"></i>
                            </span> ${friends[i]}
                        </a>`;
            $(bar).appendTo(".panel");
        }
        return
    }

    if(currentuser == username){
        for(let i = Object.keys(tweets).length - 1; i >= 0; i--){ 
            if (tweets[i] != undefined){
            $root.append(renderMyTweet(tweets[i], i));  
            }
        }
    }else{
        for(let i = Object.keys(tweets).length - 1; i >= 0; i--){ 
            if (tweets[i] != undefined){
            $root.append(renderTweet(tweets[i], i)); 
            }
        }    
    }
    
    for(let i = 0; i < Object.keys(tweets).length; i++){
        let id = i;
        if (tweets[i] != undefined){
        let body = tweets[i].body;
    
        let detail = await readTweets(id);

        if(tweets[i].isLiked.includes(username)){
            $(`#like${id}`).toggleClass('active');
        }

        if(tweets[i].isLiked.includes(username)){
            $(`#like${id}`).on("click", myUnlike)
        }
        else{
            $(`#like${id}`).on("click", myLike)
        }

        function myLike(){
            $(`#like${id}`).toggleClass('active');
            like(id);
        }
        function myUnlike(){
            $(`#like${id}`).toggleClass('active');
            unlike(id);
        }
    

        async function like(id){
            axiosInstance = axios.create({
                headers: { Authorization: `Bearer ${token}` },
                baseURL: `http://localhost:3000`
            });
            const response = await axiosInstance.get('/private/' + currentuser + `/tweet/${id}`, {});
            let temp = response.data.result;
            if(!temp.isLiked.includes(username)){
                //deleteTweets(id);
                temp.likeCount += 1;
                temp.isLiked.push(username);
                $(`#likecount${id}`).html(`(${temp.likeCount})`);
                const response1 = await axiosInstance.post('/private/' + currentuser + '/tweet/' + id, {
                    data: {
                        "type": temp.type,
                        "author": temp.author,
                        "body": temp.body,
                        "isMine": true,
                        "isLiked": temp.isLiked,
                        "replyCount":temp.replyCount,
                        "likeCount": temp.likeCount,
                        "replies": temp.replies,
                        "createdAt": temp.createdAt,
                        "updatedAt": temp.updatedAt,
                    }   
                });
                

            }
            $(`#like${id}`).unbind('click',myLike);
            $(`#like${id}`).on('click',myUnlike);
            
        }
        
        async function unlike(id){
            axiosInstance = axios.create({
                headers: { Authorization: `Bearer ${token}` },
                baseURL: `http://localhost:3000`
            });
            const response = await axiosInstance.get('/private/' + currentuser + `/tweet/${id}`, {});
            let temp = response.data.result;
            if(temp.isLiked.includes(username)){
                //deleteTweets(id);
                let index = temp.isLiked.indexOf(username);
                temp.isLiked.splice(index, 1);
                temp.likeCount -= 1;
                $(`#likecount${id}`).html(`(${temp.likeCount})`);
                const response1 = await axiosInstance.post('/private/' + currentuser + '/tweet/' + id, {
                    data: {
                        "type": temp.type,
                        "author": temp.author,
                        "body": temp.body,
                        "isMine": true,
                        "isLiked": temp.isLiked,
                        "replyCount":temp.replyCount,
                        "likeCount": temp.likeCount,
                        "replies": temp.replies,
                        "createdAt": temp.createdAt,
                        "updatedAt": temp.updatedAt,
                    }   
                });
            }
            $(`#like${id}`).unbind('click',myUnlike);
            $(`#like${id}`).on('click',myLike);
        }
    
       
        // $(`#like${id}`).click(function(){                     
        //     //$(`#like${id}`).toggleClass('active');              // indicate if user likes one tweet
        //     if(tweets[i].isLiked.includes(username)){
        //         $(`#like${id}`).toggleClass('active');
        //         unlike(id);
        //         // let index = temp.isliked.indexOf(username);
        //         // temp.isLiked.splice(index, 1);
        //     }else{
        //         $(`#like${id}`).toggleClass('active');
        //         like(id);
        //         // temp.isLiked.push(username);
        //     }
        // })

        // $(`#retweet${id}`).click(function(){                    // allow user to retweet their tweets
        //     let retweet_form = `

        //         <div class="card" id="rtcard${id}">
        //             <textarea id="readyretweet" class="textarea" maxlength="280">${body}</textarea>
        //             <button class="button is-link retweet">retweet</button>
        //             <button id="cancelretweet" class="button is-warning cancel">Cancel</button>
        //         </div>
        //     `;
        //     $(retweet_form).insertAfter(`#${id}`);
        //     $('.retweet').on('click', function(){
        //         retweet(id);
        //     });
        //     $('#cancelretweet').on('click', function(){
        //         $(`#rtcard${id}`).remove();
        //     });

        // }); 

        function loadreply(){                    // allow user to reply to tweets
            let reply_form = `
                <div class="card" id="rpcard${id}">
                    <textarea id="readyreply" class="textarea" maxlength="280" placeholder="${body}"></textarea>
                    <button class="button is-success reply">reply</button>
                    <button id="cancelreply" class="button is-warning cancel">Cancel</button>
                </div>
            `;
            $(reply_form).insertAfter(`#${id}`);
            $(`#reply${id}`).unbind("click", loadreply);
            $('.reply').on('click',async function(){
                await reply(id);
                $(`#rpcard${id}`).remove();
                location.reload()
            });
            $('#cancelreply').on('click', function(){
                $(`#rpcard${id}`).remove();
            });
        }


        $(`#reply${id}`).on("click", loadreply);


        
        if(tweets[i].replyCount > 0){
            let replies = detail.replies;
            for(let j = 0; j < replies.length; j++){
                let author = replies[j].author;
                let histweet = replies[j].body;
                $(`#replycontent${id}`).append(`<img class="replyimg" src="wyb.JPG" alt="myimage">
                                                <span class="replyauthor">${author}: ${histweet}</span><br>`);
            }
        }

        // allow user to edit their tweets   
        
            $(`#edit${id}`).on('click',  loadEdit);
            function loadEdit(){
                let form = `
                <div class="card" id="card${id}">
                    <textarea id="underedit" class="textarea" maxlength="280" placeholder="${body}"></textarea>
                    <button class="button is-link update">Update</button>
                    <button id="canceledit" class="button is-warning cancel">Cancel</button>
                 </div>
                `;
                $(form).insertAfter(`#${id}`);
                $(`#edit${id}`).unbind('click',  loadEdit);
                $('.update').on('click', async function(){
                    await updateTweets(id);
                    $(`#edit${id}`).on('click',  loadEdit);
                    location.reload();
                });
                $('#canceledit').on('click', function(){
                    $(`#card${id}`).remove();
                    $(`#edit${id}`).on('click',  loadEdit);
                });

            }

            $(`#delete${id}`).on('click', function(){
                deleteTweets(id);
                location.reload();
            });
        }
    }

    let friends = await findTenFriends();
    for(let i = 0; i < friends.length; i++){
        let url = "../home/index.html?token=" + token + "&username=" + friends[i]
        let bar = `<a href=${url} class="panel-block is-active">
                        <span class="panel-icon">
                        <i class="fas fa-people-carry"></i>
                        </span> ${friends[i]}
                    </a>`;
        $(bar).appendTo(".panel");
    }
}

view();
$('#newtweet').on('click', handleNewButtonPress); 

/******* ****************************************** right panel *********************************************************/
async function findTenFriends(){
    const response = await axiosInstance.get('/private/' + username + '/closest10');
    return response.data.result;
}