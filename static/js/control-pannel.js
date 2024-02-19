function updateTemperatureValue(value) {
    document.getElementById("temperature-value").textContent = value;
}

function updateMaxContent(value){
    document.getElementById("max-token-value").textContent = value;
}

const defaultValue = "0.2";

function toggleEditable(elementId) {
    const spanElement = document.getElementById(elementId);
    const isEditable = spanElement.getAttribute('contenteditable');
    if (isEditable === 'true') {
        spanElement.contentEditable = 'false';
        if (spanElement.textContent.trim() === "") {
        spanElement.textContent = defaultValue;
        }
    } else {
        spanElement.contentEditable = 'true';
        spanElement.focus();
    }
}

function makeEditable(elementId) {
    const spanElement = document.getElementById(elementId);
    spanElement.contentEditable = 'true';
    spanElement.focus();
}

// Add event listener to body to make input non-editable on click anywhere
document.body.addEventListener('click', function(event) {
    const spanElement = document.querySelector('span[contenteditable="true"]');
    if (spanElement) {
        spanElement.contentEditable = 'false';
        if (spanElement.textContent.trim() === "") {
        spanElement.textContent = defaultValue;
        }
    }
});