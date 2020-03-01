function sendPOST(url, content) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(content)
}

document.getElementById('testBtn').onclick = function () {
    sendPOST(document.getElementById('testURL').value, document.getElementById('testContent').value)
}