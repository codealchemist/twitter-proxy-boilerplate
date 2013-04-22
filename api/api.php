<?php
/**
 * Basic API to run backend code.
 * Works as a proxy for services.
 */
require_once 'core/Settings.class.php';
require_once 'controllers/TwitterController.class.php';

$raw = (array) json_decode(file_get_contents('php://input'), true);
//print_r($raw); exit;

$object = $raw['object'];
$method = $raw['method'];
$params = $raw['params'];
$obj = new $object;
$response = $obj->$method( $params );

header('Content-type: application/json');
die($response);
