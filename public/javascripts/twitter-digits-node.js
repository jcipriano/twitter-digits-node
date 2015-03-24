(function () {

	/**
	 * Initialize Digits for Web using your application's
	 * consumer key that Fabric generated
	 */
	function init () {

		Digits.init({ consumerKey: config.farbic_consumer_key });

		$('#login-btn').click(onLoginButtonClick);
	}

	/**
	 * Launch the Login to Digits flow.
	 */
	function onLoginButtonClick (event) {  
	  Digits.logIn().done(onLogin).fail(onLoginFailure);
	}


	function onLogin (loginResponse) {   
	    
    var oAuthHeaders = loginResponse.oauth_echo_headers;
    
    var verifyData = {
      authHeader: oAuthHeaders['X-Verify-Credentials-Authorization'],
 			apiUrl: oAuthHeaders['X-Auth-Service-Provider']
    };
 		
 		console.log(verifyData);

		$.ajax({
		  type: "POST",
		  url: '/verify',
		  data: verifyData,
		  success: onVerify
		});
	}


	function onLoginFailure (loginResponse) {
		console.log(loginResponse)
	}


	function onVerify (resp) {
		console.log(resp)
	}


	init();

})();



