$(function () {
    loadDom();
});

function loadDom() {
    const $root = $("#root");
    for(let i = 0; i < 20; i++) {
        $root.append(`<div class="question" id=` + i + `></div>`);
    }
    let score = 0;
    let q = new Array(20);
    q[0] = "You enjoy vibrant social events with lots of people.";
    q[1] = "You often spend time exploring unrealistic yet intriguing ideas.";
    q[2] = "Your travel plans are more likely to look like a rough list of ideas than a detailed itinerary.";
    q[3] = "You often think about what you should have said in a conversation long after it has taken place.";
    q[4] = "If your friend is sad about something, your first instinct is to support them emotionally, not try to solve their problem.";
    q[5] = "People can rarely upset you.";
    q[6] = "You often rely on other people to be the ones to start a conversation and keep it going.";
    q[7] = "If you have to temporarily put your plans on hold, you make sure it is your top priority to get back on track as soon as possible.";
    q[8] = "You rarely worry if you made a good impression on someone you met.";
    q[9] = "It would be a challenge for you to spend the whole weekend all by yourself without feeling bored.";
    q[10] = "You are more of a detail-oriented than a big picture person.";
    q[11] = "You are very affectionate with people you care about.";
    q[12] = "You have a careful and methodical approach to life.";
    q[13] = "You are still bothered by the mistakes you made a long time ago.";
    q[14] = "At parties and similar events you can mostly be found farther away from the action.";
    q[15] = "You often find it difficult to relate to people who let their emotions guide them.";
    q[16] = "When looking for a movie to watch, you can spend ages browsing the catalog.";
    q[17] = "You can stay calm under a lot of pressure.";
    q[18] = "When in a group of people you do not know, you have no problem jumping right into their conversation.";
    q[19] = "When you sleep, your dreams tend to be bizarre and fantastical.";
    for(let i = 0; i < 20; i++) {
        let question = document.getElementById(i);
        $(question).append(`<div class="statement">` + q[i] + `</div><div class="decision"><div class="caption agree">Agree</div><div class="options">
        <div class="option agree" id="q:` + i + `:o:1"><span class="far fa-check"></span></div> <div class="option agree" id="q:` + i + `:o:2">
        <span class="far fa-check"></span></div> <div class="option agree" id="q:` + i + `:o:3"><span class="far fa-check"></span>
        </div> <div class="option neutral" id="q:` + i + `:o:4"><span class="far fa-check"></span></div> <div class="option disagree" id="q:` + i + `:o:5">
        <span class="far fa-check"></span></div> <div class="option disagree" id="q:` + i + `:o:6"><span class="far fa-check"></span>
        </div> <div class="option disagree" id="q:` + i + `:o:7"><span class="far fa-check"></span></div></div><div class="caption disagree">Disagree</div></div>`)
    }
    $(".option").on("click", record);
}

function record(e) {
    let clas = e.currentTarget.className.split(" ")[1]; 
    let id = e.currentTarget.id;
    let question = id.split(":")[1], option = id.split(":")[3];
    for(let i = 0; i < 7; i++) {
        if(i < 3) {
            document.getElementById("q:" + question + ":o:" + (i+1)).setAttribute("class", "option agree");
        }
        else if(i > 3) {
            document.getElementById("q:" + question + ":o:" + (i+1)).setAttribute("class", "option disagree");
        }
        else {
            document.getElementById("q:" + question + ":o:" + (i+1)).setAttribute("class", "option neutral");
        }
    }
    e.currentTarget.setAttribute("class", "option " + clas + " active");
    console.log("question " + question + ", option " + option);
}