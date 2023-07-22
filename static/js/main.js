const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector("#delete-btn");
const response_model_class = document.querySelector(".response-model")

let userText = null;




const loadDataFromLocalstorage = () => {
 
    const defaultText = `<div class="default-text">
                            <h1>CodeGen: LLMDriven Coding</h1>
                            <p>This is a code instruct Model.</p>
                            <p>If you have any query regarding the code,<br>just type the query and you will get the answer</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container

}


const createChatElement = (content, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv; // Return the created chat div
}

  
const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "api/instruct_resp";
    const pElement = document.createElement("p"); // Create a new p element
        
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt: userText,
        })
    }
    // Send POST request to API, get response and set the reponse as paragraph element text
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
            showResponse();
            const {done,value} = await reader.read();
            if (done){ // when  response is completed
                const sendmsgoptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        question: userText,
                        answer: result
                    })
                }
            
                await fetch("/conv",sendmsgoptions);
                break;
            }

            result += decoder.decode(value);
            
            pElement.textContent = result;  
            incomingChatDiv.querySelector(".chat-details").appendChild(pElement);

        }
        
    } catch (error) { // Add error class to the paragraph element and set error text
<<<<<<< HEAD
=======
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
>>>>>>> 2e2dfaacc7aec58b6835c4fb454002c1049ceeac
        pElement.classList.add("error");
        pElement.textContent = error;
    }
    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);

    
    localStorage.setItem("all-chats", prash_text.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    // Display the typing animation and call the getChatResponse function
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 640 512" class=user_icon><style>user_icon{fill:#ffffff}</style><path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/></svg>
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
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
    
}

function getCookieValue(cookieName) {
    var cookieString = document.cookie;
    var cookieArray = cookieString.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(cookieName + '=') === 0) {
            return cookie.substring(cookieName.length + 1);
        }
    }

    return null; // Cookie not found
}

const stopResponse = async () => {
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
        }
    }

    await fetch("/api/stop",requestOptions)
}

const showResponse = () => {
    const html = `
        <div class="generate-response">
            <span onclick="stopResponse(this)">Stop Generation</span>
        </div>
    `;
    const responseModel = createChatElement(html,"responses");
    response_model_class.appendChild(responseModel);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if(!userText) return; // If chatInput is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512" class=user_icon><style>.user_icon{fill:#ffffff}</style><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
                        <p>${userText}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalstorage function
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});


const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {   
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without Shift and the window width is larger 
    // than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

loadDataFromLocalstorage();
sendButton.addEventListener("click", handleOutgoingChat);