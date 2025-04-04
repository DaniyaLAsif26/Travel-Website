const form = document.getElementById('form')
const title = document.getElementById('title')
const description = document.getElementById('description')
const image = document.getElementById('image')
const price = document.getElementById('price')
const country = document.getElementById('country')
const locationForm = document.getElementById('location-form')

console.log("Hello")

form.addEventListener('submit', e => {
    // Prevent form submission
    e.preventDefault()

    // Perform input validation
    if (checkInputs()) {
        console.log("Form Submitted Successfully!")

        resetFormStyles();

        form.submit()
    }
})

function checkInputs() {
    let isValid = true

    // Trim removes blank spaces
    const titleValue = title.value.trim()
    const descriptionValue = description.value.trim()
    const imageValue = image.value.trim()
    const priceValue = price.value.trim()
    const countryValue = country.value.trim()
    const locationValue = locationForm.value.trim()

    // Validate each field
    if (titleValue === '') {
        setError(title, 'Title cannot be empty')
        isValid = false
    }
    else if (titleValue.length <= 5) {
        setError(title, 'The title is to short')
        isValid = false
    }
    else {
        setSuccess(title)
    }

    if (descriptionValue === '') {
        setError(description, 'Description cannot be empty')
        isValid = false
    }
    else if (descriptionValue.length <= 9) {
        setError(description, 'Description is to short')
        isValid = false
    }
    else {
        setSuccess(description)
    }

    // if (imageValue === '') {
    //     setError(image, 'Please enter image URL')
    //     isValid = false
    // } else {
    //     setSuccess(image)
    // }

    if (priceValue === '') {
        setError(price, 'Price cannot be empty');
        isValid = false;
    } else if (isNaN(priceValue)) {
        setError(price, 'Price must be a valid number');
        isValid = false;
    } else if ((priceValue) <= 0) {
        setError(price, 'Price must be greater than zero');
        isValid = false;
    }
    else {
        setSuccess(price);
    }

    if (countryValue === '') {
        setError(country, 'Country cannot be empty')
        isValid = false
    } else {
        setSuccess(country)
    }

    if (locationValue === '') {
        setError(locationForm, 'Location cannot be empty')
        isValid = false
    } else {
        setSuccess(locationForm)
    }

    return isValid // Return true if all inputs are valid
}

function setError(element, message) {
    const formControl = element.parentElement
    const errorSpan = formControl.querySelector('span')

    formControl.className = 'form-control error'
    errorSpan.innerText = message
}

function setSuccess(element) {
    const formControl = element.parentElement
    formControl.className = 'form-control success'
}


function resetFormStyles() {
    const formControls = form.querySelectorAll('.form-control');
    formControls.forEach(formControl => {
        formControl.className = 'form-control'; // Reset to default class (no 'error' or 'success')
    });

    // Optional: Clear all error messages
    const errorSpans = form.querySelectorAll('.form-control span');
    errorSpans.forEach(span => {
        span.innerText = '';
    });
}

// flash message

function closeMessage(button) {
    const flashDiv = button.parentElement;
        flashDiv.style.display = 'none';
}