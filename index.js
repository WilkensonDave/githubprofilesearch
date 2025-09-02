"use strict"

let urlApi = "https://api.github.com/users/";

let fetch = document.createElement("script");

fetch.src = "https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js";
fetch.integrity = "sha512-DZqqY3PiOvTP9HkjIWgjO6ouCbq+dxqWoJZ/Q+zPYNHmlnI2dQnbJ5bxAHpAMw+LXRm4D72EIRXzvcHQtE8/VQ==";
fetch.crossOrigin = "anonymous";

document.head.appendChild(fetch);


let inputBox= document.getElementById("inputBox");
let displayProfile = document.getElementById("profile");
let userInput = document.getElementById("user-input");

const UpdateUI =  (name)=>{
    axios(urlApi + name).then((response) =>{
        userCard(response.data)
        userRepository(name)
    }).catch((err) =>{
        if (err.response.status == 404){
            errorFunction("No profile matches this name.")
        }
    });
};

const userCard = (user) =>{
    let id = user.name || user.login;
    let bio = user.bio ? `<p>${user.bio}</p>` : "";

    let cardElement = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}"
            alt = "${user.name}"
            class ="avatar" id="img">
        </div>

        <div class="user-info">
        <h2>${id}</h2>${bio}<ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.publik_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
        </div>
    </div>`;
    displayProfile.innerHTML = cardElement
}

const userRepository = (name) =>{
    axios(urlApi + name + "/repos?sort=created").then((response) =>{
        repositoryFunction(response.data)
    }).catch((error) =>{
        if(error.response.status == 404){
            errorFunction("Error fetching repos");
        }
    });
}

const errorFunction = (error) =>{
    let cardHtml = `<div>
    <h1>${error}</h2>
    </div>`;
    displayProfile.innerHTML = cardHtml;
}

const repositoryFunction = (repos) =>{
    let reposElement = document.getElementById("repos");
    for(let i = 0; i < 5 && i < repos.length; i++){
        let repo = repos[i];
        let repoEl = document.createElement("a");
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;
        reposElement.appendChild(repoEl);
    }
}

userInput.addEventListener("submit", (e) =>{
    e.preventDefault();
    let user = inputBox.value;
    if(user){
        UpdateUI(user);
        inputBox.value = "";
    }
    displayProfile.style.display = "block";
});