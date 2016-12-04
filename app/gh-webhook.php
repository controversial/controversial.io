<?php

if ($_POST['payload']) {
  shell_exec('cd /var/www/controversial.io');
  shell_exec('git pull');
  shell_exec('npm install');
  shell_exec('gulp build');
  shell_exec('echo hello > webhook-test.txt');
}

?>
