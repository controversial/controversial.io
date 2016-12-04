<?php

if ($_POST['payload']) {
  file_put_contents('webhook-test.json', $_POST['payload']);
  shell_exec('cd /var/www/controversial.io');
  shell_exec('git pull');
  shell_exec('npm install');
  shell_exec('gulp build');
}

?>
