export const renderHeroCard = function(hero) {
    // TODO: Copy your code from a04 to render the hero card
    // TODO: Generate HTML elements to represent the hero
    // TODO: Return these elements as a string, HTMLElement, or jQuery object
    // Example: return `<div>${hero.name}</div>`;
    return `
  <div class="column is-one-third heroCard" id="${hero.id}Card">
    <div class="card">
      <div class="card-image has-text-centered" style="background-color: ${hero.backgroundColor}">
        <br>
        <figure class="image is-128x128 center" >
          <img src="${hero.img}" alt="Placeholder image" class="roundBorder">
        </figure>
        <br>
        <h2 class="title is-2" style="color:${hero.color}">${hero.name}</h2>
        <br>
      </div>
      <div class="card-content">
        <div class="content">
          <h5 class="subtitle is-4 has-text-grey has-text-weight-bold">${hero.subtitle}</h5>
          <p class="thick" > <span style="font-weight:bold">Alter ego: </span>${hero.first} ${hero.last}</p >
          <p class="thick" > <span style="font-weight:bold">First appearance:</span> ${hero.firstSeen}</p >
          <p> <span style="font-weight:bold">Short Description: <br /></span>${hero.description} </p >
          <br>
          <button class="button is-dark is-pulled-right editButton" id="${hero.last}" type="button">Edit</button>
          <br>
        </div>
      </div>
    </div>
  </div>`
};


const renderMyTweet = function(tweet) {
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
                            <div class="column is-3">
                                <button class="like three-button " id="like${tweet.id}">
                                    <i class="fas fa-thumbs-up"></i> Like (${tweet.likeCount})
                                </button>
                            </div>
                            <div class="column is-3">
                                <button class="three-button" id="reply${tweet.id}">
                                    <i class="fas fa-comment-dots"></i> Reply (${tweet.replyCount})
                                </button>
                            </div>
                            <div class="column is-3">
                                <button class="three-button" id="retweet${tweet.id}">
                                    <i class="fas fa-retweet"></i> Retweet (${tweet.retweetCount})
                                </button>
                            </div>
                            <div class="column is-2">
                                <button class="three-button" id="edit${tweet.id}">
                                    <i class="fas fa-user-edit"></i> Edit
                                </button>
                            </div>
                            <div class="column is-1">
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

async function readTweets(id) {
    const result = await axios({
        method: 'get',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
    });
    return result.data;
}

async function postTweets() {
    const result = await axios({
        method: 'POST',
        url: 'http://localhost:3000/private',
        data: {
            "tweet": $("#writenew").val()
        },
    });
    console.log(result);
}

async function retweet(id) {
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

async function reply(id) {
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

async function like(id) {
    const result = await axios({
        method: 'put',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/like`,
        withCredentials: true,
    });
}

async function unlike(id) {
    const result = await axios({
        method: 'put',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}/unlike`,
        withCredentials: true,
    });
}

async function deleteTweets(id) {
    const result = await axios({
        method: 'delete',
        url: `https://comp426fa19.cs.unc.edu/a09/tweets/${id}`,
        withCredentials: true,
    });
}

async function getTweets() {
    const result = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
    });
    return result.data;
}

async function updateTweets(id) {
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
        if (tweet.isMine) {
            $root.append(renderMyTweet(tweet));
        } else {
            $root.append(renderTweet(tweet));
        }

    });


    for (let i = 0; i < tweets.length; i++) {
        let id = tweets[i].id;
        let body = tweets[i].body;
        let detail = await readTweets(id);

        if (tweets[i].isLiked) {
            $(`#like${id}`).toggleClass('active');
        }

        $(`#like${id}`).click(function() {
            //$(`#like${id}`).toggleClass('active');              // indicate if user likes one tweet
            if (tweets[i].isLiked) {
                $(`#like${id}`).toggleClass('active');
                unlike(id);
            } else {
                $(`#like${id}`).toggleClass('active');
                like(id);
            }
        })

        $(`#retweet${id}`).click(function() { // allow user to retweet their tweets
            let retweet_form = `

                <div class="card" id="rtcard${id}">
                    <textarea id="readyretweet" class="textarea" maxlength="280">${body}</textarea>
                    <button class="button is-link retweet">retweet</button>
                    <button id="cancelretweet" class="button is-warning cancel">Cancel</button>
                </div>
            `;
            $(retweet_form).insertAfter(`#${id}`);
            $('.retweet').on('click', function() {
                retweet(id);
            });
            $('#cancelretweet').on('click', function() {
                $(`#rtcard${id}`).remove();
            });

        });

        $(`#reply${id}`).click(function() { // allow user to reply to tweets
            let reply_form = `
                <div class="card" id="rpcard${id}">
                    <textarea id="readyreply" class="textarea" maxlength="280" placeholder="${body}"></textarea>
                    <button class="button is-success reply">reply</button>
                    <button id="cancelreply" class="button is-warning cancel">Cancel</button>
                </div>
            `;
            $(reply_form).insertAfter(`#${id}`);
            $('.reply').on('click', function() {
                reply(id);
            });
            $('#cancelreply').on('click', function() {
                $(`#rpcard${id}`).remove();
            });
        });



        if (tweets[i].replyCount > 0) {
            let replies = detail.replies;
            for (let j = 0; j < replies.length; j++) {
                let author = replies[j].author;
                let histweet = replies[j].body;
                $(`#replycontent${id}`).append(`<img class="replyimg" src="wyb.JPG" alt="myimage">
                                                <span class="replyauthor">${author}: ${histweet}</span><br>`);
            }
        }

        // allow user to edit their tweets   
        if (tweets[i].isMine) {
            $(`#edit${id}`).on('click', function() {
                let form = `
                <div class="card" id="card${id}">
                    <textarea id="underedit" class="textarea" maxlength="280" placeholder="${body}"></textarea>
                    <button class="button is-link update">Update</button>
                    <button id="canceledit" class="button is-warning cancel">Cancel</button>
                 </div>
                `;
                $(form).insertAfter(`#${id}`);
                $('.update').on('click', function() {
                    updateTweets(id);
                });
                $('#canceledit').on('click', function() {
                    $(`#card${id}`).remove();
                });

            });

            $(`#delete${id}`).on('click', function() {
                deleteTweets(id);
            });
        }

    }


}

view();
$('#newtweet').on('click', handleNewButtonPress);