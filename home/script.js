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
                                    <i class="fas fa-comment-dots"></i> Reply <span id="replycount${id}">(${tweet.replyCount})</span>
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
                                    <i class="fas fa-comment-dots"></i> Reply <span id="replycount${id}">(${tweet.replyCount})</span>
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
                "isLiked": false,
                "replyCount":0,
                "likeCount": 0,
                "replies": [],
                "createdAt": Date.now(),
                //"updatedAt": Date.now(),
            
        }   
    });  
}

async function reply(id){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.get('/private/' + currentuser + `/tweet/${id}`, {});
    let temp = response.data.result;
    deleteTweets(id);
    temp.replies.push({
        "author": username,
        "parent": id,
        "body": $("#readyreply").val(),
    });
    temp.replyCount += 1;
    $(`#replycount${id}`).html(`(${temp.replyCount})`);
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

async function like(id){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.get('/private/' + currentuser + `/tweet/${id}`, {});
    let temp = response.data.result;
    if(!temp.isLiked){
        deleteTweets(id);
        temp.isLiked = true;
        temp.likeCount += 1;
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
    
}

async function unlike(id){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.get('/private/' + currentuser + `/tweet/${id}`, {});
    let temp = response.data.result;
    if(temp.isLiked){
        deleteTweets(id);
        temp.isLiked = false;
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
    const response = await axiosInstance.get('/private/' + currentuser + '/tweet');
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
    let $root = $(".tweets");
    
    let tweets = await getTweets();
    if(currentuser == username){
        for(let i = Object.keys(tweets).length - 1; i >= 0; i--){ 
            $root.append(renderMyTweet(tweets[i], i));  
        }
    }else{
        for(let i = Object.keys(tweets).length - 1; i >= 0; i--){ 
            $root.append(renderTweet(tweets[i], i)); 
        }    
    }
    
    for(let i = 0; i < Object.keys(tweets).length; i++){
        let id = i;
        let body = tweets[i].body;
        let detail = await readTweets(id);

        if(tweets[i].isLiked){
            $(`#like${id}`).toggleClass('active');
        }
       
        $(`#like${id}`).click(function(){                     
            //$(`#like${id}`).toggleClass('active');              // indicate if user likes one tweet
            if(tweets[i].isLiked){
                $(`#like${id}`).toggleClass('active');
                unlike(id);
                tweets[i].isLiked = false;
            }else{
                $(`#like${id}`).toggleClass('active');
                like(id);
                tweets[i].isLiked = true;
            }
        })

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

        $(`#reply${id}`).click(function(){                    // allow user to reply to tweets
            let reply_form = `
                <div class="card" id="rpcard${id}">
                    <textarea id="readyreply" class="textarea" maxlength="280" placeholder="${body}"></textarea>
                    <button class="button is-success reply">reply</button>
                    <button id="cancelreply" class="button is-warning cancel">Cancel</button>
                </div>
            `;
            $(reply_form).insertAfter(`#${id}`);
            $('.reply').on('click', function(){
                reply(id);
            });
            $('#cancelreply').on('click', function(){
                $(`#rpcard${id}`).remove();
            });
        }); 


        
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
        
            $(`#edit${id}`).on('click', function(){                   
                let form = `
                <div class="card" id="card${id}">
                    <textarea id="underedit" class="textarea" maxlength="280" placeholder="${body}"></textarea>
                    <button class="button is-link update">Update</button>
                    <button id="canceledit" class="button is-warning cancel">Cancel</button>
                 </div>
                `;
                $(form).insertAfter(`#${id}`);
                $('.update').on('click', function(){
                    updateTweets(id);
                });
                $('#canceledit').on('click', function(){
                    $(`#card${id}`).remove();
                });
                
            });

            $(`#delete${id}`).on('click', function(){
                deleteTweets(id);
            });
        

    }

    let friends = await findTenFriends();
    for(let i = 0; i < friends.length; i++){
        let bar = `<a class="panel-block is-active">
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