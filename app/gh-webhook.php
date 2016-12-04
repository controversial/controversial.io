<?php

$payload = json_decode(file_get_contents('php://input'));

if ($payload) {
  file_put_contents('/var/www/controversial.io/webhook-test.json', file_get_contents('php://input'));
  shell_exec('cd /var/www/controversial.io');
  shell_exec('git pull');
  shell_exec('npm install');
  shell_exec('gulp build');
  echo('done');
}

?>
