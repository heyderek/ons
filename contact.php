<?php
  require_once('includes/recaptchalib.php');

	// just save time if the captcha wasn't entered correctly.
	if (empty($_POST["recaptcha_response_field"])) {
		die("The reCAPTCHA wasn't entered correctly. Please try it again.");
	}

	$to = 'TM Technologies Support <support@tmtechnologies.us>';
	$from = validate_email($_POST['contact_email']);
	$subject = 'TM Technologies Web Inquiry';
	$message = validate_message($_POST['contact_message']);
	$name = validate_name($_POST['contact_name']);

  $privatekey = '###################';
  $resp = recaptcha_check_answer(
		$privatekey,
		$_SERVER["REMOTE_ADDR"],
		$_POST["recaptcha_challenge_field"],
		$_POST["recaptcha_response_field"]
	);

  if ($resp->is_valid) {
		$headers = 'From: support@tmtechnologies.us' . "\r\n" .
				"Reply-To: $from\r\n" .
				'X-Mailer: PHP/' . phpversion();

  //var_dump($to, $subject, $message, $headers);exit;
		$sent = mail($to, $subject, $message, $headers);

		// occasionally, mail() return a blank value as TRUE
		if ($sent == '' || $sent) {
			die('success');
		}

		die('Failed to send contact request. Please try sending again in a few minuets.');
	} else {
		die("The reCAPTCHA wasn't entered correctly. Please try it again.");
	}

	die('Uh-Oh, an error has occured but I don"t know what exactly caused it. Please give us a call.');


	#######################################################
	function validate_email($email) {
		$email = trim($email);

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
			list($user,$domain) = preg_split("/\@/",$email,2);

			if (!checkdnsrr($domain,"MX") && !checkdnsrr($domain,"A")) {
				die('Please enter a valid email address.');
			}
    } else {
			die('Please enter a valid email address.');
		}

		return $email;
	}

	function validate_name($name) {
		$name = trim(strip_tags(htmlspecialchars_decode($name)));

		if (strlen($name) < 1 || strlen($name) > 100 || preg_match('/your name/i', $name)) {
			die('Your name must be between 1 and 100 characters.');
		}

		return $name;
	}

	function validate_message($message) {
		$message = wordwrap(trim(strip_tags(htmlspecialchars_decode($message))), 70);

		if (strlen($message) < 1 || strlen($message) > 3000 || preg_match('/your message/i', $message)) {
			die('Your message must be between 1 and 3000 characters.');
		}

		return $message;
	}
?>