const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector("#delete-btn");

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
    const API_URL = "/instruct_resp";
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
        const reader = response.body.getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            let receivedData = "";
            receivedData += chunk;
            const words = receivedData.split("\n");
            let word = words[0];
            let remaining = "";


            if (word.includes("  ")) {
                const doubleSpaceIndex = word.indexOf("  ");
                const nextLine = word.substring(0, doubleSpaceIndex)  + "\n" ;
                const remainingSpace = word.substring(doubleSpaceIndex + 2);
                const trimmedRemainingSpace = remainingSpace.trim();
                const spacesOnNextLine = remainingSpace.match(/ +/g);

                if (spacesOnNextLine) {
                    word = nextLine + spacesOnNextLine.join("\n");
                    remaining += words.slice(1).join("\n");
                    remaining = trimmedRemainingSpace.length > 0 ? trimmedRemainingSpace + " " : "";
                } else {
                    remaining = words.slice(1).join("\n");
                }
            }

            pElement.textContent += word + "";
            incomingChatDiv.querySelector(".chat-details").appendChild(pElement);

            if (remaining) {
                // Create a new paragraph for the remaining space
                const newPElem = document.createElement("p");
                newPElem.textContent = remaining;
                incomingChatDiv.querySelector(".chat-details").appendChild(newPElem);
            }

            receivedData = "";
        }
        

        /* while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            receivedData += chunk;
            const words = receivedData.split("\n");
            let word = words[0];
            let remaining = "";
            if (words.length > 1) {
              if (word.includes("  ")) {
                const doubleSpaceIndex = word.indexOf("  ");
                const nextLine = word.substring(0, doubleSpaceIndex) + "\n";
                const remainingSpace = word.substring(doubleSpaceIndex + 2);
                const trimmedRemainingSpace = remainingSpace.trim();
                const spacesOnNextLine = remainingSpace.match(/ +/g);
                if (spacesOnNextLine) {
                  word = nextLine + spacesOnNextLine.join("\n");
                  remaining += words.slice(1).join("\n");
                  remaining = trimmedRemainingSpace.length > 0 ? trimmedRemainingSpace + " " : "";
                } else {
                  remaining = words.slice(1).join("\n");
                }
              } else {
                remaining = words.slice(1).join("\n");
              }
            }
            pElement.textContent += word;
            incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
            if (remaining) {
              // Create a new paragraph for the remaining space
              const newPElem = document.createElement("p");
              newPElem.textContent = remaining;
              incomingChatDiv.querySelector(".chat-details").appendChild(newPElem);
            }
            receivedData = "";
        } */
          

        /* while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = new TextDecoder().decode(value);
            receivedData += chunk;
            const words = receivedData.split("\n");
            let word = words[0];
            let remaining = "";
            if (words.length > 1) {
                if (word.includes("  ")) {
                    const doubleSpaceIndex = word.indexOf("  ");
                    const nextLine = word.substring(0, doubleSpaceIndex) + "\n";
                    const remainingSpace = word.substring(doubleSpaceIndex + 2);
                    const trimmedRemainingSpace = remainingSpace.trim();
                    const spacesOnNextLine = remainingSpace.match(/ +/g).join("\n");
                    word = nextLine + spacesOnNextLine;
                    remaining += words.slice(1).join(" ");
                    remaining = trimmedRemainingSpace.length > 0 ? trimmedRemainingSpace + " " : "";
                }
            }
            pElement.textContent += word;
            incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
            if (remaining) {
                // Create a new paragraph for the remaining space
                const newPElem = document.createElement("p");
                newPElem.textContent = remaining;
                incomingChatDiv.querySelector(".chat-details").appendChild(newPElem);
            }
            receivedData = "";
        } */
             
        
    } catch (error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = error;
    }



    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
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
                        <img src="images/chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
    if(!userText) return; // If chatInput is empty return from here

    // Clear the input field and reset its height
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="images/user.jpg" alt="user-img">
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