<?php

$githubProfile = file_get_contents('https://github.com/controversial');
$contributionsIndex = strpos($githubProfile, 'contributions');

printf(substr($githubProfile, $contributionsIndex-10, 50));

?>
