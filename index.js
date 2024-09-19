// Initialize the DOM elements
const totalTimeElement = document.getElementById('totalTime')
const remainingTimeElement = document.getElementById('remainingTime')
const trackerForm = document.getElementById('trackerForm')
const trackerElement = document.getElementById('trackerValue')
const trackerValue = trackerElement.getAttribute('name')


// time tracking functions

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

const getTotalTime = (timeArray) => {
  const totalMinutes = timeArray.reduce((total, time) => total + timeToMinutes(time), 0)

  return minutesToTime(totalMinutes)
}

const subtractFrom45Hours = (timeArray) => {
  const totalMinutes = timeArray.reduce((total, time) => total + timeToMinutes(time), 0)
  const fortyFiveHoursInMinutes = 45 * 60
  const resultMinutes = fortyFiveHoursInMinutes - totalMinutes

  return minutesToTime(resultMinutes)
}


// form actions functions

const resetFormFields = (form) => {
  const inputs = form.querySelectorAll('input, select, textarea')
  inputs.forEach(input => {
    if (input.type === 'checkbox' || input.type === 'radio') {
      input.checked = false
    } else {
      input.value = ''
    }
  })
}

const updateDisplayedTimes = (totalTime, remainingTime) => {
  if(totalTimeElement && remainingTimeElement) {
    totalTimeElement.textContent = totalTime
    remainingTimeElement.textContent = remainingTime
  }
}

const processTimes = (timesArray) => {
  const totalTime = timesArray ? getTotalTime(timesArray) : 0
  const remainingTime = timesArray ? subtractFrom45Hours(timesArray) : 0

  updateDisplayedTimes(totalTime, remainingTime)
}

const handleFormSubmit = (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)
  const value = formData.get(trackerValue)
  const timesArray = value.split('\t')

  processTimes(timesArray)
}

const handleFormReset = (event) => {
  event.preventDefault()

  resetFormFields(event.target)

  processTimes()
}

const initFormListeners = (form) => {
  form.addEventListener('submit', handleFormSubmit)
  form.addEventListener('reset', handleFormReset)
}

initFormListeners(trackerForm)
