var Cookies = require('js-cookie');
export const STATE_COOKIE_NAME = "TABLEAU_STATE_COOKIE";

export default class tabBridge {
  static getRequestedClass() {
    return _tabBridge.getRequestedClass();
  }

  static getState() {
    return _tabBridge.getState();
  }

  static submitState(state) {
    Cookies.remove(STATE_COOKIE_NAME);
    console.log("submitting state: " + JSON.stringify(state));

    function applyDefaultIfMissing(obj, name, val) {
      if (!obj.hasOwnProperty(name)) {
        obj[name] = val;
      }
    }

    applyDefaultIfMissing(state.savedState, "authSecrets", {});
    applyDefaultIfMissing(state.savedState, "authMatchingAttrs", {});
    applyDefaultIfMissing(state.savedState, "username", "");

    _tabBridge.submitState(state);
  }

  static reportError(msg) {
    _tabBridge.reportError(msg);
  }

  static changeAuth() {
    _tabBridge.changeAuth();
  }

  static cancel() {
    _tabBridge.cancel();
  }
}
