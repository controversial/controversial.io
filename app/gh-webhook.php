<?php

$payload = json_decode(file_get_contents('php://input'));

if ($payload) {
  echo(shell_exec('cd /var/www/controversial.io 2>&1'));
  echo(shell_exec('git pull 2>&1'));
  echo(shell_exec('npm install 2>&1'));
  echo(shell_exec('gulp build 2>&1'));
  echo('done');
}

?>
