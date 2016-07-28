import 'babel-polyfill'
var Cookies = require('js-cookie');

import tabBridge, {STATE_COOKIE_NAME} from './tabBridge.js';
//import {initMockBridge} from './tabBridgeMock';
//import RequestorFactory from './requestors/RequestorFactory'
initMockBridge();

var requestedClass = tabBridge.getRequestedClass();
var savedStateString = Cookies.get(STATE_COOKIE_NAME);

var state = null;
if (savedStateString) {
  var state = JSON.parse(savedStateString);
} else {
  var stateFromTableau = tabBridge.getState();
  if (stateFromTableau.class == requestedClass) {
    state = stateFromTableau;
  }
}

if (!state || state.class != requestedClass) {
  state = { class: requestedClass }
}

console.log("State is " + JSON.stringify(state));
debugger;


//var requestorFactory = new RequestorFactory();

// Next we have to decide what to do
console.log("Saved state is " + stateFromTableau);
//if (state.savedState && requestorFactory.constructRequestor(requestedClass, state).hasValidAuthentication()) {
if (state.savedState)
    // we're good, report the state back
    tabBridge.submitState(state);