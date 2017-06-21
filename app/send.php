<?php

header("Content-type: text/html");

$sender = $_POST["name"];
$email = $_POST["email"];
$message = $_POST["message"];
$headers = "From: '".$sender."' <contact@controversial.io>\r\n";

$success = false;
if (strlen(trim($sender)) > 0 && strlen(trim($email)) > 0 && strlen(trim($message)) > 0) {
  $success = true;
  mail("luke@deentaylor.com", "Contact form | ".$email, $message, $headers);
}

?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Thanks for getting in touch.</title>

    <style>
      @import url('https://fonts.googleapis.com/css?family=Montserrat:600');
      body {background-color:#2d3940;margin:0;color:white;position:fixed;}
      .content-main {width:50vw;position:absolute;top:50vh;left:50vw;transform:translate(-50%, -50%);text-align:center;}
      h1 {font-family:'Montserrat';font-weight:600;font-size:6vw;margin:0;font-weight:bold;text-transform:uppercase;}
      h2 {font-family:'Montserrat';font-weight:600;font-size:3vw;margin:0;font-weight:400;}
      canvas {width:100vw;height:100vh;}
    </style>

  </head>
  <body>
    <canvas id="boids"></canvas>
    <div class="content-main">
      <h1><?= $success ? "Email sent" : "Email not sent" ?></h1>
      <h2 style="display: <?= $success ? "block" : "none"?>">Thanks for getting in touch, <?php echo explode(" ", $sender)[0]; ?>. I'll get back to you shortly.</h2>
      <h2 style="display: <?= $success ? "none" : "block"?>">Go back and fill in the missing fields</h2>
    </div>

    <!-- TODO: replace this with an implementation of Boids, because flocking
    birds are weakly connected to email sending -->
    <script type="text/javascript" src="dist/emailsent.js"></script>
  </body>
</html>
