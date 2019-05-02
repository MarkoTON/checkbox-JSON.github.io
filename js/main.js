//// User looping
document.getElementById("submitCheckbox").addEventListener("click", printCheckboxValue);

function printCheckboxValue(e){
	// Default print in UI
	document.getElementById("userSocNetUI").innerHTML = 
	`<p class="mt-5 mx-auto lead">Pick some info about Marko, and submit! :)</p>`
	;
	// Get First Form from HTML
	let getFormCheckbox = document.getElementsByTagName("form")[0];
	for(let i = 0; i < getFormCheckbox.length; i++){
		if(getFormCheckbox[i].checked){
			// Sending checked value to funtion to handle UI
			printInfoUser(getFormCheckbox[i].value);
		}
	}
	e.preventDefault();
}

function printInfoUser(pickedValue){
	// Value from printCheckboxValue();
	let pickedItem = Number(pickedValue);
	
	// Hvatanje JSON-a i konvertovanje
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(xhttp.responseText);
			// Capture first USER form JSON
			let user = response[0];
			let userSocNet = user.socialNetworks; // JSON User 
			for(let i = 0; i < userSocNet.length; i++){
				if(i === pickedItem){
					// Sending value to funtion to print UI
					printUI(userSocNet[i].name,userSocNet[i].address,userSocNet[i].icon);
				}
			}
		}
	};
	xhttp.open("GET", "json/markoInfo.json", true);
	xhttp.send();
}

function printUI(name,address,icon){
	document.getElementById("userSocNetUI").innerHTML += `
	<div class="col-md-6">
	<div class="card m-2">
	<div class="card-header">
	<i class="${icon}"></i>
	<p class="d-inline-block">${name}</p> 
	</div>
	<div class="card-body">
	<a href="${address}" target="_blank">${name} address (Click here!)</a>
	</div>
	</div>
	</div>
	`;
}

//// RAM looping
// Adding event listener to butten
document.getElementById("submitCheckboxRAM").addEventListener("click", printRAM);

// Default print on load
printAllRamUI();
function printAllRamUI(){
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let response = JSON.parse(xhttp.responseText);
			let ramJSON = response; // JSON / RAM Memory Info
			ramJSON.forEach(element => {
				document.getElementById("ramUI").innerHTML += 
				`
				<div class="card mb-1 d-inline-block">
					<div class="card-body">
						${element.name}
					</div>
				</div>
				`
				;
			});
		}
	};
	xhttp.open("GET", "json/RAM.json", true);
	xhttp.send();
}

// Main function that handle whole steps towards printing RAM to UI
function printRAM(e){
	// Restart UI list
	document.getElementById("ramUI").innerHTML = ``;
	// Get value form Checkbox's
	let getFormCheckbox = document.querySelectorAll(".ramName");
	let getMemoryValue = document.querySelectorAll(".gbMemoryValue");

	// Array's for testing /  > // Testing if checkbox are all check or not
	let checkForm = [];
	let checkMemory = [];
	
	// Pushing in array only checkt value
	let arrCheckboxName = [];
	let arrMemoryValue = [];
	for(let i = 0; i < getFormCheckbox.length; i++){
		if(getFormCheckbox[i].checked){
			arrCheckboxName.push(getFormCheckbox[i].value);
		} else {
			checkForm.push(getFormCheckbox[i].value);
		}
	}
	for(let i = 0; i < getMemoryValue.length; i++){
		if(getMemoryValue[i].checked){
			arrMemoryValue.push(getMemoryValue[i].value);
		} else {
			checkMemory.push(getMemoryValue[i].value);
		}
	}

	// Testing if checkbox are all check or not
	if(getMemoryValue.length === checkMemory.length && getFormCheckbox.length === checkForm.length) printAllRamUI();

	handleRamName();
	function handleRamName(){
		// Pushing all Obj from JSON/RAM to array for another function to check and print only one that pass check list / > // handleMemoryValue()
		let currentObjRAM = [];

		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(xhttp.responseText);
				let ramJSON = response; // JSON / RAM
				for(let i = 0; i < ramJSON.length; i++){
					for(let k = 0; k < arrCheckboxName.length; k++){
						if(ramJSON[i].id === Number(arrCheckboxName[k])){
							currentObjRAM.push(ramJSON[i]);
							document.getElementById("ramUI").innerHTML += `
							<div class="card mb-1 d-inline-block">
								<div class="card-body">
									${ramJSON[i].name}
								</div>
							</div>
							`;
						}
					}
				}
				handleMemoryValue(currentObjRAM);
			}
		};
		xhttp.open("GET", "json/RAM.json", true);
		xhttp.send();
	}
	
	function handleMemoryValue(currentObjRAM){
		// Assigning value to arrObj from argument
		let arrObj = currentObjRAM;
		// Colection of Ram that will be print
		let onlyRamForPrinting = [];
		console.log(onlyRamForPrinting);
		
		for(let k = 0; k < arrMemoryValue.length; k++){
			document.getElementById("ramUI").innerHTML = "";
			for(let i = 0; i < arrObj.length; i++){
				if(arrObj[i].memoryCapacity.includes(Number(arrMemoryValue[k])) == true){
					onlyRamForPrinting.push(arrObj[i].name);
				}
			}
		}
		console.log(onlyRamForPrinting);

		let reduceRamName = [...new Set(onlyRamForPrinting)];
	
		reduceRamName.forEach(element => {
			
			document.getElementById("ramUI").innerHTML += `
				<div class="card mb-1 d-inline-block">
					<div class="card-body">
						${element}
					</div>
				</div>
			`;
		});
	}
	
	e.preventDefault();
}