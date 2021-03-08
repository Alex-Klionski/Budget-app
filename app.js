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


// GOOGLE STATISTICS

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Газ', 'Объём'],
        ['Еда',     78.09],
        ['Развлечения', 20.95],
        ['Магазин',    0.93],
        ['Квартира  ', 0.03]
    ]);
    var options = {
        title: 'Бюджет',
        is3D: true,
        pieResidueSliceLabel: 'Остальное'
    };
    var chart = new google.visualization.PieChart(document.getElementById('air'));
        chart.draw(data, options);
}

google.setOnLoadCallback(drawChart2);
function drawChart2() {
    var data = google.visualization.arrayToDataTable([
        ['День недели', 'Траты', 'Доход'],
        ['Понедельник', 1.3, 70],
        ['Вторник', 2000, 3120],
        ['Среда', 12170, 9920]
    ]);
    var options = {
        title: 'Траты/Доход',
        hAxis: {title: 'День недели'},
        vAxis: {title: 'Бел. рубли'}
    };
    var chart = new google.visualization.ColumnChart(document.getElementById('oil'));
        chart.draw(data, options);
}