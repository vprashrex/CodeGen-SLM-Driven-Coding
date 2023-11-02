// sending the userInput chat
const redis = require('redis');

const r = redis.createClient({
    host: 'localhost', // Your Redis server host
    port: 6379,        // Your Redis server port
    // Other options like password can be added if needed
  });

function formatTimestamp(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


var sendButton = document.getElementById("send-btn");

sendButton.addEventListener("click", function () {
    var inputText = chatInput.value.trim();

    if (inputText.length > 0) {
        var inputWords = inputText.split(" ");
        
        var title = inputWords.slice(0, 3).join(" ");
        console.log("tile : "+title);

        var titleDiv = document.getElementById("title "+sessionStorage.getItem("present_session"));
        if (titleDiv){
            if (titleDiv.innerText == "New Chat"){
                titleDiv.innerText = title;
            }
        }


        if (!sessionStorage.getItem("start")){
            createNewDiv(title);
        }
        chatInput.value = inputText;
        handleOutgoingChat()
        sessionStorage.setItem("start", true);
    }
    
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            session_id: sessionStorage.getItem("present_session"),
            userText: inputText,
            title:titleDiv.innerText, 
            html: chatContainer.innerHTML,
            timestamp: formatTimestamp(new Date())
        })
    }
    fetch("/chat",requestOptions);
    
});

r.hget(session_id, "html", (err, value) => {
    if (err) {
      console.error('Error getting field from Redis hash: ' + err);
    } else {
      console.log('Value from Redis hash: ' + value);
    }
  });

sendButton.addEventListener("click", sendChat);
