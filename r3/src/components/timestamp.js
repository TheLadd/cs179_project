
// bug: shows single digits 
export default function handleTimestamp() {
    let date = new Date() // add something for exact format - does not account for single digit times/dates 
    let timestampst = date.toLocaleDateString()
    timestampst += ": " + date.getHours().toString() + ":" + date.getMinutes().toString()
    console.log(timestampst)
    return timestampst; 

}