function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
}
function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
function getTotalTime(timeArray) {
    const totalMinutes = timeArray.reduce((total, time) => total + timeToMinutes(time), 0);

    return minutesToTime(totalMinutes);
}
function subtractFrom45Hours(timeArray) {
    const totalMinutes = timeArray.reduce((total, time) => total + timeToMinutes(time), 0);
    const fortyFiveHoursInMinutes = 45 * 60;
    const resultMinutes = fortyFiveHoursInMinutes - totalMinutes;

    return minutesToTime(resultMinutes);
}


document.getElementById('trackerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    const formData = new FormData(event.target);
    const value = formData.get('trackerValue');

    const timesArray = value.split('\t');
    const totalTime = getTotalTime(timesArray);
    const remainingTime = subtractFrom45Hours(timesArray);

    document.getElementById('totalTime').textContent = totalTime;
    document.getElementById('remainingTime').textContent = remainingTime;

});
