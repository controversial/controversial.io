<?php

$githubProfile = file_get_contents('https://github.com/controversial');
$contributionsIndex = preg_match(
  '/contributions\s+in the last year/',
  $githubProfile,
  $matches,
  PREG_OFFSET_CAPTURE
);
$index = $matches[0][1];

printf($index);
printf(substr($githubProfile, $index-20, 50));

?>
