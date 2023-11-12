const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector("#delete-btn");
const response_model_class = document.querySelector(".response-model");
const restart_response_model = document.querySelector(".restart-response-model");
const chat_history = document.querySelector(".chat_history");

let count = localStorage.getItem("chat-count") || 0;
let userText = null;
const going = {
    chat:false
};


const hideAnimation = () =>{
    document.getElementById("key-animation").style.visibility = "hidden";
    document.getElementById("send-btn").style.visibility = "visible";
}
const showAnimation = () =>{
    document.getElementById("key-animation").style.visibility = "visible";
    document.getElementById("send-btn").style.visibility = "hidden";
}

hideAnimation();



const loadDataFromLocalstorage = () => {
 
    const defaultText = `<div class="default-text">
                            <h1>CodeGen: LLMDriven Coding</h1>
                            <p>This is a code instruct Model.</p>
                            <p>If you have any query regarding the code,<br>just type the query and you will get the answer</p>
                        </div>`

    chatContainer.innerHTML = defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

}


const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
}

function formatTimestamp(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
  
const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "api/instruct_resp";
    const pElement = document.createElement("p");

    if (document.getElementById("restart")){
        hideRestart();
    }
    
    showResponse();
    showAnimation();
    
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: userText,
        })
    }

    var inputWords = userText.split(" ");
        
    var title = inputWords.slice(0, 3).join(" ");

    var titleDiv = document.getElementById("title "+sessionStorage.getItem("present_session"));
    console.log(sessionStorage.getItem("present_session"));
    
    if (titleDiv){
        if (titleDiv.innerText == "New Chat"){
            titleDiv.innerText = title;
        }

    }
    if (!sessionStorage.getItem("start")){
        createNewDiv(title);
    }
    sessionStorage.setItem("start", true);

    try {
        const response = await fetch(API_URL,requestOptions);
        const contentType = response.headers.get("Content-Type");
        const stream = new ReadableStream({
            start(controller){
                const reader = response.body.getReader();
                function read(){
                    return reader.read().then(({done,value}) => {
                        if(done){
                            controller.close();
                            
                            return;
                        }
                        controller.enqueue(value);
                        return read();
                    });
                }
                return read();
            }
        });
        const readableStreamResponse = new Response(stream,{
            headers: {'Content-Type': contentType}
        });
        const decoder = new TextDecoder();
        let result = "";
        const reader = readableStreamResponse.body.getReader();
        
        while (true){
            const {done,value} = await reader.read();
            going.chat = true;
            if (done){
                going.chat = false;
                hideAnimation();
                
                //chatContainer.innerHTML = response.html_code.trim();

                break;
            }
            result += decoder.decode(value);
            pElement.textContent = result;  
            incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
        }
    } catch (error) { 
        pElement.classList.add("error");
        pElement.textContent = error;
    }



    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);

    /* CODE FOR STORING CONVERSATION IN REDIS */
    const sendmsgoptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            session_id: sessionStorage.getItem("present_session"),
            userText: userText,
            html: chatContainer.innerHTML,
            title: title ? title: titleDiv.innerText,
            timestamp: formatTimestamp(new Date())
        })
    }

    await (await fetch("/conv",sendmsgoptions)).json();
    /* --------------------------------------------------------------------- */

    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);


    /// once done run post all the information to the server

}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}


const showTypingAnimation = () => {
    const html = `
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 640 512" id=bot class=user_icon><style>user_icon{fill:#ffffff}</style><path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/></svg>
                </div>
                <div class="chat-content">
                    <div class="chat-details">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>
                `;

    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    count++;
    localStorage.setItem("chat-count",count);
    chatContainer.appendChild(incomingChatDiv);
    sessionStorage.setItem("chat_count",`chat-${count}`);
    incomingChatDiv.classList.add(`chat-${count}`)
    chatContainer.scrollTo(0,chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
    
}



const stopResponse = () => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    };
    $.ajax({
        url: "/api/stop",
        type: requestOptions.method,
        headers: requestOptions.headers,
        dataType: "json",
        success: function(response) {
            hideStop();
            restartResponse();
        },
        error: function(xhr, status, error) {
            // Handle errors here
            console.error(status, error);
        }
    });
    console.log("yes!")   
}




const restart_generation = async () => {
    const API_URL = "api/restart";
    
    const chat_count = `.chat.incoming.chat-${localStorage.getItem("chat-count")}`;
    const incomingChatDiv = document.querySelector(chat_count);
    const chatDetailsDiv = incomingChatDiv.querySelector(".chat-details");
    const existingParagraphs = chatDetailsDiv.querySelectorAll("p");
    const pElement = document.createElement("p");
    
    existingParagraphs.forEach((paragraph) => {
        chatDetailsDiv.removeChild(paragraph);
    });
    hideRestart();
    showResponse();
    showAnimation();
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: userText,
        }),
    };
    try {
        const response = await fetch(API_URL, requestOptions);
        const contentType = response.headers.get("Content-Type");
        const stream = new ReadableStream({
            start(controller) {
                const reader = response.body.getReader();
                function read() {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        return read();
                    });
                }
                return read();
            },
        });
        const readableStreamResponse = new Response(stream, {
            headers: { 'Content-Type': contentType },
        });
        const decoder = new TextDecoder();
        let result = "";
        const reader = readableStreamResponse.body.getReader();
        while (true) {
            going.chat = true;
            const { done, value } = await reader.read();
            if (done) {
                pElement.textContent = result;
                chatDetailsDiv.appendChild(pElement);
                localStorage.setItem("all-chats", chatContainer.innerHTML);
                chatContainer.scrollTo(0, chatContainer.scrollHeight);
                hideAnimation();
                going.chat=false;
                break;
            }
            result += decoder.decode(value);
            pElement.textContent = result;
            incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
        }
    } catch (error) {
        pElement.classList.add("error");
        pElement.textContent = error;
        chatDetailsDiv.appendChild(pElement);
        localStorage.setItem("all-chats", chatContainer.innerHTML);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    }
    incomingChatDiv.querySelector(".typing-animation").remove();
};

const hideStop = () => {
    response_model_class.classList.add("hidden");
}

const hideRestart = () => {
    console.log("hideRestart")
    restart_response_model.classList.add("hidden");
}

const hideAllResponse = () => {
    hideStop();
    hideRestart();
}

const showResponse = () => {
    const html = `
        <div class="generate-response" id="stop">
            <span onclick="stopResponse()">Stop Generation</span>
        </div>
    `;
    if (response_model_class.classList.contains("hidden")){
        response_model_class.classList.remove("hidden");
    }
    const responseModel = createChatElement(html,"responses");
    response_model_class.appendChild(responseModel);
}

const restartResponse = () =>{
    const html = `
        <div class="restart-response" id="restart">
            <span onclick="restart_generation()">Restart Response</span>
            
        </div>  
    `;
    if (restart_response_model.classList.contains("hidden")){
        restart_response_model.classList.remove("hidden");
    }
    const responseModel = createChatElement(html,"restart-responses");
    restart_response_model.appendChild(responseModel);   
}



const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if(!userText) return;
    
    
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512" class=user_icon><style>.user_icon{fill:#ffffff;}</style><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>

                </div>
                <div class="chat-content">
                    <div class="chat-details">
                        <p>${userText}</p>
                    </div>
                </div>`;

    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}



const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {   
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});



chatInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800 && !going.chat) {
        e.preventDefault();
        handleOutgoingChat();
    }
    

});




function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}


var create_div = document.getElementById("create_div");
var id_count = 1;
var chat_hist_cont = document.getElementById("chat-history");
let globalDiv



async function localRefresh() {
    var sessionID = sessionStorage.getItem("present_session");

    const sendmsgoptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"   
        },
        body: JSON.stringify(
            {
                session_id: sessionID ? sessionID : 'none'
            }
        )
    };

    try {
        const resp = await fetch("/fetch_session", sendmsgoptions);
        const data = await resp.json(); 
        console.log(data.content);
        Object.entries(data.content).forEach(([key, value]) => {
            const session_id = key;
            const title = value[0];
            createNewDiv(title,session_id);
            // IMPORATANT CHANGE ---> CHANGE ONLY THE INDEX VALUE
            chatContainer.innerHTML = value[1];
            chatContainer.scrollTo(0, chatContainer.scrollHeight);
            
        });
        
        //loadDataFromLocalstorage();

    } catch (error) {
        console.error("Error:", error);
    }


}

localRefresh();

function createNewDiv(title,session_id = undefined) {
    if (session_id === undefined){
        var sessionId = generateRandomString(5);
    }
    else{
        sessionId = session_id;
    }
    
    sessionStorage.setItem(sessionId, sessionId);
    sessionStorage.setItem("present_session",sessionId);

    var new_div = document.createElement("div");
    new_div.id = "history-" + sessionId;
    new_div.className = "chat-hist-div";
    var dict = new Map();
    dict.set("session_id", sessionId);
    new_div.dataMap = dict;
    document.body.appendChild(new_div);
    
    /* new_div.appendChild(editIcon); */

    var deleteIcon = document.createElement("span");
    deleteIcon.className = "fas fa-trash-alt del-icon";
    deleteIcon.style.cursor = "pointer";

    deleteIcon.addEventListener("click", function (event) {
        var history = document.getElementById(new_div.id);
        console.log(history.dataMap.get("session_id"));
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"   
            },
            body: JSON.stringify(
                {
                    session_id: history.dataMap.get("session_id")
                }
            )
            
        }
        const API_URL = "/remove_session"
        fetch(API_URL,requestOptions);

        event.stopPropagation();
        deleteDiv(new_div);
        //chatContainer.innerHTML = "";
        loadDataFromLocalstorage();
    });


    new_div.appendChild(deleteIcon);

    var titleDiv = document.createElement("div");
    titleDiv.innerText = title;
    titleDiv.style.fontWeight = "bold";
    titleDiv.id = "title "+sessionStorage.getItem("present_session");

    new_div.appendChild(titleDiv);
    chat_hist_cont.appendChild(new_div);
    
    new_div.addEventListener("click", function () {
        var history = document.getElementById(new_div.id);
        console.log(history.dataMap.get("session_id"));
        sessionStorage.setItem("session", history.dataMap.get("session_id"));

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    session_id: history.dataMap.get("session_id")
                }
            )
        }
        const API_URL = "/session"
        fetch(API_URL,requestOptions)
            .then(response => response.json())
            .then(data => chatContainer.innerHTML = data.content.trim())
            .catch(error => console.log("Error : ",error))
        /* const res = fetch(API_URL,requestOptions).json();
        console.log(res) */
    });

    
    id_count++;
}
/* deleteButton.addEventListener("click", () => {
    //console.log(sessionStorage.getItem("present_session"));
   
    
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        localStorage.removeItem("chat-count");
        loadDataFromLocalstorage();
        hideAllResponse();
        count=0;
        const mydiv = document.getElementById("history-"+sessionStorage.getItem("present_session"))
        mydiv.remove()
        if (chat_hist_cont.querySelectorAll("div").length === 0) {
            sessionStorage.removeItem("start");
        }
        sessionStorage.removeItem("present_session");
        
        
    }
}); */

function deleteDiv(div) {
    var sessionId = div.dataMap.get("session_id");
    sessionStorage.removeItem(sessionId);
    div.remove();
    if (chat_hist_cont.querySelectorAll("div").length === 0) {
        sessionStorage.removeItem("start");
    }
    sessionStorage.removeItem("all-chats");
    sessionStorage.removeItem("chat-count");
    hideAllResponse();
    count=0;
    sessionStorage.removeItem("present_session");
    sessionStorage.removeItem("start");
    loadDataFromLocalstorage();

}


create_div.addEventListener("click", function () {
    sessionStorage.removeItem("present_session");
    var inputText = chatInput.value.trim();
    if (inputText.length > 0) {
        var inputWords = inputText.split(" ");
        var title = inputWords.slice(0, 3).join(" ");
        createNewDiv(title);
        chatInput.value = "";
        sessionStorage.setItem("start", true);
    }
    else {
        createNewDiv("New Chat");
        sessionStorage.setItem("start", true);
    }
    loadDataFromLocalstorage();
});



function sendChat() {
    var inputText = chatInput.value.trim();

    if (inputText.length > 0) {
        var inputWords = inputText.split(" ");
        var title = inputWords.slice(0, 3).join(" ");
        if (!sessionStorage.getItem("start")) {
            createNewDiv(title);
        }
        chatInput.value = inputText;
        handleOutgoingChat();
        sessionStorage.setItem("start", true);
    }
}

create_div.addEventListener("click",sendChat);

sendButton.addEventListener("click", handleOutgoingChat);