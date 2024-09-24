// Initialize the DOM elements
const totalTimeElement = document.getElementById('totalTime')
const remainingTimeElement = document.getElementById('remainingTime')
const trackerForm = document.getElementById('trackerForm')
const inputElements = document.querySelectorAll('.tracker__form_input')
const defaultInputValue = document.querySelector('.tracker__form_input').value


// functions to handle value paste
const handleSingleValuePaste = (inputElement, value) => {
  inputElement.value = value
}
const handleMultipleValuesPaste = (values, numValues) => {
  inputElements.forEach((inputElement, index) => {
    inputElement.value = index < numValues ? values[index] : ''
  })
}
const handlePaste = (event) => {
  event.preventDefault()

  const pasteData = event.clipboardData.getData('text').trim()
  const values = pasteData.split(/\s+/)
  const numValues = Math.min(values.length, inputElements.length)

  if (values.length === 1) {
    handleSingleValuePaste(event.target, values[0])
  } else {
    handleMultipleValuesPaste(values, numValues)
  }
}
inputElements.forEach(input => {
  input.addEventListener('paste', handlePaste)
})


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
const validateTimeFormat = (time) => {
  const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
  return timePattern.test(time)
}

const getInputValuesArray = (formData) => {
  const inputValuesArray = []

  inputElements.forEach(input => {
    const value = formData.get(input.name)
    if (value && validateTimeFormat(value)) {
      inputValuesArray.push(value)
    } else {
      console.log('Error: ', value )
      resetFormFields(trackerForm)
      processTimes()
    }
  })

  return inputValuesArray
}

const resetFormFields = (form) => {
  const inputs = form.querySelectorAll('input, select, textarea')
  inputs.forEach(input => {
    if (input.type === 'checkbox' || input.type === 'radio') {
      input.checked = false
    } else {
      input.value = defaultInputValue
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
  const inputValuesArray = getInputValuesArray(formData)

  processTimes(inputValuesArray)
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
