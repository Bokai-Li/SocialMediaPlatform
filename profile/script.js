function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
let token = getUrlVars()["token"];
let username;



async function getUsername(){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response1 = await axiosInstance.get('/account/status', {});
    return response1.data.user.name;
}

const renderProfile = function(profile) {
    return `
    <div id="${username}">
        <div class="card">
            <div class="card-image has-text-centered" style="background-color: #362f81">
                <br>
                <figure class="image is-128x128 center">
                    <img src="wyb.JPG" class="roundBorder">
                </figure>
                <br>
                <h2 class="title is-2" style="color:white">"${username}"</h2>
                <br>
            </div>
            <div class="card-content">
                <div class="content">
                    <p class="thick"> <span style="font-weight:bold">Country: </span> <span id="country${username}">"${profile.country}"</span></p>
                    <p class="thick"> <span style="font-weight:bold">City:</span> </span> <span id="city${username}">"${profile.city}"</span></p>
                    <p class="thick"> <span style="font-weight:bold">Phone Number:</span> </span> <span id="phno${username}">"${profile.phoneNumber}"</span></p>
                    <p class="thick"> <span style="font-weight:bold">Email:</span></span> <span id="email${username}">"${profile.email}"</span></p>
                    <br>
                    <button id="editbutton${username}" class="button is-pulled-right editButton is-warning" type="button ">Edit</button>
                    <br>
                </div>
            </div>
        </div>
    </div>
    `;
};

const renderEditProfile = function(profile){
    return `
    <div id="edit${username}">
        <div class="card">
            <div class="card-image has-text-centered" style="background-color: #362f81">
                <br>
                <figure class="image is-128x128 center">
                    <img src="wyb.JPG" class="roundBorder">
                </figure>
                <br>
                <h2 class="title is-2" style="color:white">${username}</h2>
                <br>
            </div>
            <div class="card-content">
                <div class="content">    
                    <div class="field">
                            <label class="label">Country</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class="input" id="country" placeholder="country input" value="${profile.country}">        
                            </div>
                    </div>

                    <div class="field">
                            <label class="label">City</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class="input" id="city" placeholder="city input" value="${profile.city}">
                            </div>
                        </div>

                    <div class="field">
                                <label class="label">Phone Number</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" id="phno" placeholder="phone NO. input" value="${profile.phoneNumber}">
                                </div>
                    </div>   
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control has-icons-left has-icons-right">
                            <input class="input" id="email" placeholder="Email input" value="${profile.email}">               
                        </div>
                    </div>
                    <button class="button is-pulled-right cancelButton is-danger" type="button">Cancel</button>
                    <button class="button is-pulled-right updateButton is-warning" type="button">Update</button>
                    <br>
                </div>
            </div>
        </div>
    </div>
    
    `; 
}

async function readProfile(){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.get('/user/profile');
    return response.data.result;
}

async function deleteProfile(){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    const response = await axiosInstance.delete('/user/profile', {});
}

async function updateProfile(){
    axiosInstance = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: `http://localhost:3000`
    });
    

    const response1 = await axiosInstance.post('/user/profile', {
        data: {
            "country": $('#country').val(),
            "city": $('#city').val(),
            "phoneNumber": $('#phno').val(),
            "email": $('#email').val()
        }   
    });
}

async function view() {
    username = await getUsername();
    $('#gohome').attr("href", `/home/index.html?token=${token}&username=${username}`);
    $('#goearth').attr("href", `/ball/index.html?token=${token}`);
    $('#goprofile').attr("href", `/profile/index.html?token=${token}&username=${username}`);

    let profile = await readProfile();
    let $root = $("#root");
    $root.append(renderProfile(profile));  
       
    $(`#editbutton${username}`).on('click', function(){  
        handleedit(profile);
        $('.updateButton').on('click', handleupdate);
        $('.cancelButton').on('click', handlecancel);  
    });
        

    
}
 
const handleedit = function(profile){
    let form = renderEditProfile(profile);
    $(`#${username}`).replaceWith(form);
}

const handleupdate = async function(){
    updateProfile();
    let profile = await readProfile();
    $(`#edit${username}`).replaceWith(renderProfile(profile));
    $(`#editbutton${username}`).on('click', function(){  
        handleedit(profile);
        $('.updateButton').on('click', handleupdate);
        $('.cancelButton').on('click', handlecancel);  
    });
}

const handlecancel = async function(){
    let profile = await readProfile();
    $(`#edit${username}`).replaceWith(renderProfile(profile));
    $(`#editbutton${username}`).on('click', function(){  
        handleedit();
        $('.updateButton').on('click', handleupdate);
        $('.cancelButton').on('click', handlecancel);  
    });

}

view();

