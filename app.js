// TIME
function showTime(){
    var today = new Date()
    var h = today.getHours()
    var m = today.getMinutes()
    var s = today.getSeconds()
    var session = "AM"

    if (h === 0){
        h = 12;
    }
    if (h > 12) {
        h -= 12;
        session = "PM";
    }
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = h + ":" + m + ":" + s + session;
    var dateTime = `${date} ${time}`
    document.getElementById('clockDisplay').innerHTML = dateTime;
    document.getElementById('clockDisplay').textContent = dateTime;
    setTimeout(showTime, 1000)
}
showTime()
