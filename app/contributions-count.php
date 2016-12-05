<?php

$githubProfile = file_get_contents('https://github.com/controversial');
$contributionsIndex = preg_match(
  '/contributions\s+in the last year/',
  $githubProfile,
  $matches,
  PREG_OFFSET_CAPTURE
);
$index = $matches[0][1];
$endIndex = $index;

while (is_numeric($githubProfile[$index-2]) || $githubProfile[$index-2] == ',')
  $index--;

$contributionsCount = substr($githubProfile, $index-1, $endIndex-$index);

echo(str_replace(',', '', $contributionsCount));

?>
