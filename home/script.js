function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

let currentuser = getUrlVars()["username"];
let token = getUrlVars()["token"];
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
});
const response1 = await axiosInstance.get('/account/status', {});
let username = response1.data.user.name;

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

const renderTweet = function(tweet) {
    return `
        
    <div class="card" id ="${tweet.id}">
        <div class="card-content">
            <div class="content">
                <img class="headimg" src="wyb.JPG" alt="myimage">
                &nbsp;&nbsp;
                <span class="author">
                    ${tweet.id.author}
                </span>  
                <p>${tweet.id.body}</p>
            </div>

            <div class="content has-text-left">
                @Shanghai-Xuhui
                <br>
                ${tweet.id.createdAt}
            </div>
    
            <div class="content with-border" >
                    <div class="columns" id="button">
                            <div class="column is-6">
                                <button class="like three-button " id="like${tweet.id}">
                                    <i class="fas fa-thumbs-up"></i> Like (${tweet.id.likeCount})
                                </button>
                            </div>
                            <div class="column is-6">
                                <button class="three-button" id="reply${tweet.id}">
                                    <i class="fas fa-comment-dots"></i> Reply (${tweet.id.replyCount})
                                </button>
                            </div>
                    </div>
            </div>
            


            <div class="content replyblockbefore" id="replycontent${tweet.id}">

            </div>
        </div>
    </div>
    `;
};

const renderMyTweet = function(tweet){
    return `
     
    <div class="card" id ="${tweet.id}">
        <div class="card-content">
            <div class="content">
                <img class="headimg" src="wyb.JPG" alt="myimage">
                &nbsp;&nbsp;
                <span class="author">
                    ${tweet.id.author}
                </span>  
                <p>${tweet.id.body}</p>
            </div>

            <div class="content has-text-left">
                @Shanghai-Xuhui
                <br>
                ${tweet.id.createdAt}
            </div>

            <div class="content with-border" >
                    <div class="columns" id="button">
                            <div class="column is-3">
                                <button class="like three-button " id="like${tweet.id}">
                                    <i class="fas fa-thumbs-up"></i> Like (${tweet.id.likeCount})
                                </button>
                            </div>
                            <div class="column is-3">
                                <button class="three-button" id="reply${tweet.id}">
                                    <i class="fas fa-comment-dots"></i> Reply (${tweet.id.replyCount})
                                </button>
                            </div>
                            <div class="column is-3">
                                <button class="three-button" id="edit${tweet.id}">
                                    <i class="fas fa-user-edit"></i> Edit
                                </button>
                            </div>
                            <div class="column is-3">
                                <button class="three-button" id="delete${tweet.id}">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>

                    </div>
            </div>

            <div class="content replyblockbefore" id="replycontent${tweet.id}">

            </div>
        </div>
    </div>
`; 
}

async function readTweets(id){
    const response = await axiosInstance.get('/private' + currentuser + `/tweet/${id}`, {});
    return response.data.result;
}

async function postTweets(){ 
    let id = getTweets().length;
    const response = await axiosInstance.post('/private/' + username + '/tweet', {
        data: {
            [id]: {
                "type": "tweet",
                "author": username,
                "body": $("#writenew").val(),
                "isMine": true,
                "isLiked": false,
                "replyCount":0,
                "likeCount": 0,
                "replies": [],
                "createdAt": Date.now(),
                "updatedAt": Date.now(),
            },
        }   
    });
    console.log(response);
}

async function reply(id){
    const response = await axiosInstance.post('/private/' + currentuser + `/tweet/${id}/replies`,{
        data: [{
            "author": username,
            "parent": id,
            "body": $("#readyreply").val(),
        }],
        type: "merge",
    });
}

async function like(id){
    const response = await axiosInstance.get('/private' + currentuser + `/tweet/${id}`, {});
    let temp = response.data.result;
    if(!temp.isLiked){
        deleteTweets(id);
        temp.isLiked = true;
        temp.likeCount += 1;
        const response1 = await axiosInstance.post('/private/' + currentuser + '/tweet/', {
            data: {
                [id]: {
                    temp
                }  
            }   
        });
    }
    
}

async function unlike(id){
    const response = await axiosInstance.get('/private' + currentuser + `/tweet/${id}`, {});
    let temp = response.data.result;
    if(temp.isLiked){
        deleteTweets(id);
        temp.isLiked = false;
        temp.likeCount -= 1;
        const response1 = await axiosInstance.post('/private/' + currentuser + '/tweet', {
            data: {
                [id]: {
                    temp
                }  
            }   
        });
    } 
}

async function deleteTweets(id){
    const response = await axiosInstance.delete('/private' + currentuser + `/tweet/${id}`, {});
}

async function getTweets(){
    const response = await axiosInstance.get('/private' + currentuser + '/tweet', {});
    return response.data.result;
}

async function updateTweets(id){
    const response = await axiosInstance.get('/private' + currentuser + `/tweet/${id}`, {});
    let temp = response.data.result;
    temp.body = $("#underedit").val();
    const response1 = await axiosInstance.post('/private/' + currentuser + '/tweet/', {
        data: {
            [id]: {
                temp
            }  
        }   
    });
}

async function view() {
    let $root = $(".tweets");
    let tweets = await getTweets();

    if(currentuser == username){
        tweets.forEach(tweet => {
            $root.append(renderMyTweet(tweet));  
        });
    }else{
        tweets.forEach(tweet => {
            $root.append(renderTweet(tweet));
        });
    }

    for(let i = 0; i < tweets.length; i++){
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
            }else{
                $(`#like${id}`).toggleClass('active');
                like(id);
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
        if(tweets[i].isMine){
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

    }

   
}

view();
$('#newtweet').on('click', handleNewButtonPress); 

/******* ****************************************** right panel *********************************************************/
async function findTenFriends(id){
    const response = await axiosInstance.get('/private' + username + `closest10`, {});
    return response.data.result;
}

async function panel(){
    
}