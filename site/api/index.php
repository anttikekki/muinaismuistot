<?php

require_once 'Muinaismuistot.php';

$muinaismuistot = new Muinaismuistot();
$muinaismuistot->runRequest(array_merge($_GET, $_POST));