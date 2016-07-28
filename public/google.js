var STATE_COOKIE = "TABLEAU_STATE_COOKIE";


(function() {
  'use strict';

  // This config stores the important strings needed to
  // connect to the foursquare API and OAuth service
  //
  // Storing these here is insecure for a public app
  // See part II. of this tutorial for an example of how
  // to do a server-side OAuth flow and avoid this problem
  var config = {
      clientId: '22113114763-u06o31b965cja76bo05burvru7l3ldb6.apps.googleusercontent.com',
      redirectUri: 'http://localhost:3333/redirect',
      authUrl: 'https://accounts.google.com/',
      version: '20150901',
      //username: 'macwam2@gmail.com',
      scope: 'email profile https://www.googleapis.com/auth/drive.readonly'
  };

  // Called when web page first loads and when
  // the OAuth flow returns to the page
  //
  // This function parses the access token in the URI if available
  // It also adds a link to the foursquare connect button
  
  $(document).ready(function() {
      debugger;
      var accessToken = Cookies.get("accessToken");
      var hasAuth = false  //accessToken && accessToken.length > 0;
      updateUIWithAuthState(hasAuth);

      $("#connectbutton").click(function() {
          doAuthRedirect();
      });
  });

  // An on-click function for the connect to foursquare button,
  // This will redirect the user to a foursquare login
  function doAuthRedirect() {
      var appId = config.clientId;
      if (tableau.authPurpose === tableau.authPurposeEnum.ephemerel) {
        appId = config.clientId;
      } else if (tableau.authPurpose === tableau.authPurposeEnum.enduring) {
        appId = config.clientId; // This should be the Tableau Server appID
      }

      var url = config.authUrl + 'o/oauth2/v2/auth?response_type=code&client_id=' + appId +
              '&redirect_uri=' + config.redirectUri + '&access_type=offline' + '&scope=' + config.scope;
      window.location.href = url;
  }
  
  // This function togglels the label shown depending
  // on whether or not the user has been authenticated
  function updateUIWithAuthState(hasAuth) {
      if (hasAuth) {
          $(".notsignedin").css('display', 'none');
          $(".signedin").css('display', 'block');
      } else {
          $(".notsignedin").css('display', 'block');
          $(".signedin").css('display', 'none');
      }
  }

}) ();
