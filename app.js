// Name: app.js
// Description: Custom Search feature implementation with search history.
// Author: Juhi Singh

let searchHistory = [];
const searchUrl = 'https://restcountries.eu/rest/v2/name';

// Creating references for HTML Elements
const  searchTextElement = document.getElementById('search-text');
var autoComplete = document.getElementById("autocomplete-container");
let historyRecords = document.getElementById('history-records');
var noSuggestion = document.getElementById("no-suggestions-section");


// Adding debounce to 'search' event to avoid multiple requests.
searchTextElement.onkeyup = debounce(searchCountry, 500);

// Adding event listener for clearing search area.
searchTextElement.addEventListener('search', function(event) {
	clearSearch();
})

/**
 * debounce
 * Triggers the callback function after the specified interval is over.
 */
function debounce(cb, interval, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
		timeout = null;
		if (!immediate) cb.apply(context, args);
	};          
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, interval);

		if (callNow) cb.apply(context, args);
	};
};

/**
 * searchCountry
 * Triggers search for auto-complete suggestions based on the input text in the search field
 */
function searchCountry() {
	if (searchTextElement.value.length > 0) {
		fetch(`${searchUrl}/${searchTextElement.value}`)
			.then((resp) => resp.json())
			.then(function (data) {
				let countries = data;
				removeChildren(autoComplete);
				checkVisibility();
				return countries.forEach(country => {
					var childListNode = createNode("li");
					childListNode.innerHTML = country.name;
					append(autoComplete, childListNode);
				});
			})
			.catch(function (error) {
				noSuggestion.style.visibility = "visible";
				noSuggestion.style.display = "block";

			});
	} else {
		removeChildren(autoComplete);
	}
}

/**
 * createNode
 * returns a html element of type mentioned in the arguement
 *
 * @param {string}   element           Element Type.
 */
function createNode(element) {
	return document.createElement(element);
}

function checkVisibility() {
	if (window.getComputedStyle(noSuggestion).visibility === "visible") {
		noSuggestion.style.visibility = "hidden";
	  }
}
/**
 * append
 * returns parent with child-element appended to it.
 *
 * @param {HTMLElement} parentElement              Parent HTMLElement.
 * @param {HTMLElement} childElement               Child HTMLElement.
 */
function append(parentElement, childElement) {
	return parentElement.appendChild(childElement);
}

/**
 * removeChildren
 * removes all the children of the element specified in the argument.
 *
 * @param {HTMLElement} element              HTMLElement whose children are required to be removed.
 */
function removeChildren(element) {
	while (element.hasChildNodes())
		element.removeChild(element.firstChild);
}

/**
 * selectSearchResult
 * Triggered from the HTML, it selects a search result clicked by the user.
 *
 * @param {*} event              Event triggered by the click on UI.
 */
function selectSearchResult(event) {
	var selectedResult = event.target.innerHTML;
	if (selectedResult.length > 0) {
		let time = moment().format('YYYY-MM-DD hh:mm A');
		let historyData = {
			value: selectedResult,
			time: time
		}
		searchHistory.push(historyData);
		document.getElementById("search-text").value = selectedResult;
		removeChildren(autoComplete);
		createHistoryRecords(historyData);
	}
}

/**
 * removeHistoryRecord
 * Removes one single history record mentioned in the argument
 *
 * @param {string} recordName              Record name that needs to be removed.
 */
function removeHistoryRecord(recordName) {
	var index = searchHistory.findIndex(x => x.value === recordName);
	if (index > -1) {
		searchHistory.splice(index, 1);
	}
	removeChildren(historyRecords);
	if (searchHistory.length >= 0) {
		searchHistory.forEach(data => {
			createHistoryRecords(data);
		})
	}

}

/**
 * createHistoryRecords
 * Creates HTML Element for a history record.
 *
 * @param {*} data              Record entry.
 */
function createHistoryRecords(data) {
	const record = createNode('div');
	record.classList.add('record');
	record.innerHTML = `
			<div class="record-value">${data.value}</div>
			<div class="record-time">
				${data.time}
				<span class="clear-action delete-button" onclick="removeHistoryRecord('${data.value}')"><span>
			</div>

			
	`;
	append(historyRecords, record);
	
}

/**
 * clearSearch
 * Clears search entry and auto-complete records. Triggered when clear button is pressed in search bar.
 *
 */
function clearSearch(){
	removeChildren(autoComplete);
	checkVisibility();
	
}

/**
 * clearAllHistory
 * Clears all search-history records.
 *
 */
function clearAllHistory(){
	removeChildren(historyRecords);
	searchHistory = [];
}

