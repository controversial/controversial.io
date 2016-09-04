<?php

$sender = $_POST["name"];
$email = $_POST["email"];
$message = $_POST["message"];
$headers = "From: '".$sender."' <contact@controversial.io>\r\n";

mail("luke@deentaylor.com", "Contact form | ".$email, $message, $headers);

echo "Email sent";
?>
