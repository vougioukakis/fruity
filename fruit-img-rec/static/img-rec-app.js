function addEvListenerToAddFactBtn(){
	const button = document.getElementById('add-fact-btn');
    button.addEventListener('click', showFactInput);
}
document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('image-input').click();
});

function addEvListenerToGetFactBtn(){
	const button = document.getElementById('get-fact-btn');
    button.addEventListener('click', getFact);
}

function addEvListenerToSubmitFactBtn(){
	const button = document.getElementById('submit-fact-btn');
    button.addEventListener('click', addFact);
}

function showFactInput(){
	document.getElementById('fact-input-container').style.display = 'flex';
}
async function addFact(){
	try {
		const factInput = document.getElementById('fact-input');
        const fact = factInput.value;

        if (fact.trim() === '') {
            throw new Error('Invalid fact');
        }

        const response = await fetch(`/add-fact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fact: fact })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error status ${response.status}`);
        }

        document.getElementById("fact-text").innerHTML = `
            <p>fact added successfully: ${data.fact}</p>
        `;

        factInput.value = '';
		document.getElementById("fact-input-container").style.display = 'none';
	} catch (e) {
		document.getElementById("fact-text").innerHTML = `
            <p style="color: red;">Error: ${e.message}</p>
        `;
    
		factInput.value = '';
		console.error('error:', e);
		factInput.focus();
		document.getElementById("fact-input-container").style.display = 'none';

	}
}

async function getFact() {
	try {
		const response = await fetch(`/get-fact`, {method:'GET'});
		const data = await response.json();

		if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

		document.getElementById("fact-text").innerHTML = data.fact;

	} catch (error) {
		document.getElementById("fact-text").innerHTML = `
			<p style="color: red;">Error: ${error.message}</p>
		`;
	}
}

function addEventListenerDiagnoseButton(){
	// submit event listener for the form to call uploadImage once submitted
	const form = document.querySelector("form.file-upload");
	console.log("adding event listener to run button...");

	if (form) {
		document.querySelector("form.file-upload").addEventListener("submit", uploadImage);
	} else {
		console.log("something went wrong with the diagnose button form");
	}
}

async function uploadImage(e){
	e.preventDefault();
	console.log("form submitted.");

	const fileInput = document.getElementById("image-input");
	const formData = new FormData();

	formData.append("disease-image", fileInput.files[0]);

	try {
		const response = await fetch("/upload", {
			method: "POST",
			body: formData,
		})

		console.log(response.status);
		console.log(JSON.stringify(response));

		if (!response.ok) {
			throw new Error("Network response was not ok.");
		}
		
		const data = await response.json();

		console.log("Data:", data);

		if (data.error) {
			console.error("Error: ", data.error);
			showErrorResult(data.error);
			return; // stop processing and show error message to user
		} else {
			document.getElementById('output-area').innerHTML = `
			<p class="fruit-title">Fruit Information: ${data.name}</p>
			<ul>
			<li>Nutrition per 100 grams:</li>
            <li class="results-item">- Calories: ${data.calories}</li>
            <li class="results-item">- Carbs: ${data.carbs}g</li>
            <li class="results-item">- Protein: ${data.protein}g</li>
            <li class="results-item">- Fat: ${data.fat}g</li></ul>
        `;
			
		}

	} catch (error) {
		console.error(
			"Error in diagnose button promise chain: ",
			error
		);
	}
}

function showErrorResult(string) {
	console.log("showing error to user...");
	document.getElementById('fruit-name').innerHTML = string;
}

/**
 adds an event listener to the image input field to handle file selection.
 When a file is chosen, the function updates the file name label,
 and displays the selected image in the output-area.
@returns {void}
 */
function addEvListenerToImgInputField() {
	const imageInputField = document.getElementById("image-input");

	imageInputField.addEventListener("change", function () {
		try {
			console.log("showing image...");
			const fileName = this.files[0] ? this.files[0].name : "No file chosen";
			document.getElementById("file-upload-label").textContent = fileName;
			
			const reader = new FileReader();
			
			// show the uploaded image in the output area
			reader.onload = function (e) {
				document.getElementById("fruit-img").src = e.target.result;
			};
			reader.readAsDataURL(this.files[0]);
			document.getElementById("diagnose-button").disabled = false;
		} catch (e) {
			console.error("Error showing image: ", e);
        }
		
	});
}

/** this function isnt used yet */
function checkToDisableDiagnoseButton() {
	const imageInputField = document.getElementById("image-input");
	console.log(imageInputField.files.length);
	if (imageInputField.files.length < 1) {
		document.getElementById("diagnose-button").disabled = true;
	} else {
		document.getElementById("diagnose-button").disabled = false;
	}
}


/**
runs when DOM is loaded.
initializes the application by adding event listeners to relevant elements and calling necessary functions.
@returns {void}
 */
function init() {
	console.log("init running");
	addEventListenerDiagnoseButton();
	addEvListenerToImgInputField();
	document.getElementById("fruit-img").src = 'static/assets/placeholder.png';
	addEvListenerToGetFactBtn();
	addEvListenerToAddFactBtn();
	addEvListenerToSubmitFactBtn();
}

document.addEventListener("DOMContentLoaded", init);
