
const handleNewButtonPress = function(event) {
    $(`<textarea id="writenew" class="textarea" maxlength="280" placeholder="Create your new tweet here (max 280 characters)"></textarea>
       <button id="newpost" class="button is-danger">Post</button>
       <button id="cancelpost" class="button is-warning">Cancel</button>
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
                    ${tweet.author}
                </span>  
                <p>${tweet.body}</p>
            </div>

            <div class="content has-text-left">
                @Shanghai-Xuhui
                <br>
                8:45 11.29.2019
            </div>
    
            <div class="content with-border" >
                    <div class="columns" id="button">
                            <div class="column is-4">
                                <button class="like three-button " id="like${tweet.id}">
                                    <i class="fas fa-thumbs-up"></i> Like (${tweet.likeCount})
                                </button>
                            </div>
                            <div class="column is-4">
                                <button class="three-button" id="reply${tweet.id}">
                                    <i class="fas fa-comment-dots"></i> Reply (${tweet.replyCount})
                                </button>
                            </div>
                            <div class="column is-4">
                                <button class="three-button" id="retweet${tweet.id}">
                                    <i class="fas fa-retweet"></i> Retweet (${tweet.retweetCount})
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
                <div>
                    <button class="button is-success edit" id="edit${tweet.id}">edit</button> 
                    <button class="button is-success remove" id="delete${tweet.id}">delete</button> 
                </div>
                
                <div class="card-content">  
                    <div class="content">  
                        <p>${tweet.author}</p>
                        <p>${tweet.body}</p>
                    </div>

                    <div class = "content has-text-right" id="button">
                        <button class="like" id="like${tweet.id}">Like(${tweet.likeCount})</button>
                        <button class="three-button" id="reply${tweet.id}">reply(${tweet.replyCount})</button>
                        <button class="three-button" id="retweet${tweet.id}">retweet(${tweet.retweetCount})</button>
                        <button class="three-button" id="show${tweet.id}">replies</button>
                    </div>

                    <div class="content replyblockbefore" id="replycontent${tweet.id}">
                    
                    </div>
                </div>
            </div>

    `;
}

async function readTweets(id){
    const result = await axios({
        method: 'get',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
    });
    return result.data;
}

async function postTweets(){
    const result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          body: $("#writenew").val()
        },
    });
}

async function retweet(id){
    const result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "retweet",
          "parent": id,
          "body": $("#readyretweet").val()
        },
    });
}

async function reply(id){
    const result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "reply",
          "parent": id,
          "body": $("#readyreply").val()
        },
    });
}

async function like(id){
    const result = await axios({
        method: 'put',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/like`,
        withCredentials: true,
    });
}

async function unlike(id){
    const result = await axios({
        method: 'put',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/unlike`,
        withCredentials: true,
    });
}

async function deleteTweets(id){
    const result = await axios({
        method: 'delete',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
    });
}

async function getTweets(){
    const result = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });
    return result.data;
}

async function updateTweets(id){
    const result = await axios({
        method: 'put',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
        data: {
          body: $("#underedit").val()
        },
    });
}

async function view() {
    let $root = $(".tweets");
    let tweets = await getTweets();
    tweets.forEach(tweet => {
        if(tweet.isMine){
            $root.append(renderMyTweet(tweet));
        }else{
            $root.append(renderTweet(tweet));
        } 
        
    });

    
    for(let i = 0; i < tweets.length; i++){
        let id = tweets[i].id;
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

        $(`#retweet${id}`).click(function(){                    // allow user to retweet their tweets
            let retweet_form = `

                <div class="card">
                    <textarea id="readyretweet" class="textarea" maxlength="280">${body}</textarea>
                    <button class="button is-success retweet">retweet</button>
                </div>
            `;
            $(`#${id}`).replaceWith(retweet_form);
            $('.retweet').on('click', function(){
                retweet(id);
            });
        }); 

        $(`#reply${id}`).click(function(){                    // allow user to reply to tweets
            let reply_form = `
                <div class="card">
                    <textarea id="readyreply" class="textarea" maxlength="280" placeholder="${body}"></textarea>
                    <button class="button is-success reply">reply</button>
                </div>
            `;
            $(`#${id}`).replaceWith(reply_form);
            $('.reply').on('click', function(){
                reply(id);
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
        if(tweets[i].isMine){
            $(`#edit${id}`).on('click', function(){                  // allow user to edit their tweets    
                let form = `
                    <div class="column is-4">   
                        <div class="card">
                            <textarea id="underedit" class="textarea" maxlength="280">${body}</textarea>
                            <button class="button is-success update">Update</button>
                        </div>
                    </div>
                `;
                $(`#${id}`).replaceWith(form);
                $('.update').on('click', function(){
                    updateTweets(id);
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

