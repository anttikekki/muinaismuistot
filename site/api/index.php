<?php

//Gzip/deflate encoding if browser supports it
ob_start("ob_gzhandler");

require_once 'Muinaismuistot.php';

$muinaismuistot = new Muinaismuistot();
$muinaismuistot->runRequest($_GET);