function addEvListenerToGetFactBtn(){
	const button = document.getElementById('get-fact-btn');
    button.addEventListener('click', getFact);
}

async function getFact() {
	try {
		const response = await fetch(`/get-fact`, {method:'GET'});
		const data = await response.json();
		document.getElementById("fact-text").innerHTML = data.fact;

	} catch (error) {
		document.getElementById("fact-text").innerHTML = `
			<p style="color: red;">Error: ${error.message}</p>
		`;
	}
}
/**
Adds an event listener to the diagnose button to handle form submission.
Inside the event listener, it fetched the results and populates the results list,
resets the form,and marks the last diagnosis as done.
This function basically controls the main loop of uploading and diagnosing.

About the backend response:
JSON form with disease_1, disease_2 and disease_3 fields/
If something goes wrong or one of them is blank, make sure it has an error field.
@returns {void}
 */
function addEvListenerToDiagnoseButton() {

	// TODO: add event listener to 'submit' form and handle it here instead of calling /upload from the html
	const form = document.querySelector("form.file-upload");
	console.log("trying to add event listener...");

	if (form) {
		document.querySelector("form.file-upload").addEventListener("submit", function (e) {
			e.preventDefault();
			console.log("form submitted.");

			const fileInput = document.getElementById("image-input");
			const formData = new FormData();

			formData.append("disease-image", fileInput.files[0]);

			// fetch the response from the '/upload' route - our json results for the prediction
			fetch("/upload", {
				method: "POST",
				body: formData,
			})
			.then((response) => response.json())
			.then((data) => {
				console.log("Data:", data); // for now this is just the fruit name

				// if something went wrong, theres an error field
				if (data.error) {
					console.error("Error: ", data.error);
					resetForm();
					showErrorResult(data.error);
					markLastAsDone();
					return; // stop processing and show error message to user
				} else {
					document.getElementById('fruit-name').innerHTML = data.name;
				}
			})
			.catch((error) => {
				console.error(
					"Error in diagnose button promise chain: ",
					error
				);
			});

		});
	} else {
		console.log("something went wrong with the diagnose button form");
	}
}

function showErrorResult(string) {
	console.log("showing error to user...");
	document.getElementById('fruit-name').innerHTML = string;
}

/**
 adds an event listener to the image input field to handle file selection.
 When a file is chosen, the function updates the file name label,
 and displays
 the selected image in the output-area.
@returns {void}
 */
function addEvListenerToImgInputField() {
	console.log("adding event listener to image input field...");
	const imageInputField = document.getElementById("image-input");
	console.log('this has been updated');
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
This function should be called every time a chat is switched to ensure proper functionality.
@returns {void}
 */
function init() {
	console.log("init running");
	addEvListenerToDiagnoseButton();
	addEvListenerToImgInputField();
	addEvListenerToGetFactBtn();
}

document.addEventListener("DOMContentLoaded", init);
