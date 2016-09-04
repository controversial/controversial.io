<?php

header("Content-type: text/html");

$sender = $_POST["name"];
$email = $_POST["email"];
$message = $_POST["message"];
$headers = "From: '".$sender."' <contact@controversial.io>\r\n";

mail("luke@deentaylor.com", "Contact form | ".$email, $message, $headers);

?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Thanks for getting in touch.</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Arvo|Open+Sans">

    <style>
      body {background-color:#2d3940;margin:0;color:white;position:fixed;}
      .content-main {width:50vw;position:absolute;top:50vh;left:50vw;transform:translate(-50%, -50%);text-align:center;}
      h1 {font-family:'Arvo';font-size:8vw;margin:0;font-weight:400;}
      h2 {font-family:'Open Sans';font-size:3vw;margin:0;font-weight:400;}
      canvas {width:100vw;height:100vh;}
    </style>

  </head>
  <body>
    <canvas id="gol"></canvas>
    <div class="content-main">
      <h1>Email sent</h1>
      <h2>Thanks for getting in touch, <?php echo explode(" ", $sender)[0]; ?>. I'll get back to you shortly.</h2>
    </div>

    <script type="text/javascript" src="js/gol.js"></script>
  </body>
</html>
