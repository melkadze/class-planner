function sendPOST(url, content) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(content)
}

function sendGET(url, content) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', url, true);
    
}


document.getElementById('testBtn').onclick = function () {
    sendPOST(document.getElementById('testURL').value, document.getElementById('testContent').value)
}