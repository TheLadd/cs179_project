
function handleTimestamp(timestamp) {
    let date = new Date(timestamp)
    let timestampst = date.toLocaleDateString()
    timestampst += ": " + date.getHours().toString() + ":" + date.getMinutes().toString()
    return timestampst; 

}