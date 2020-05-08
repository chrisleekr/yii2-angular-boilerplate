<?php

// NOTE: Make sure this file is not accessible when deployed to production
//Just get the headers if we can or else use the SERVER global.
if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
} else {
    $headers = $_SERVER;
}

if (array_key_exists('X-Forwarded-For', $headers) && filter_var($headers['X-Forwarded-For'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
    $remote_address = $headers['X-Forwarded-For'];
} elseif (array_key_exists('HTTP_X_FORWARDED_FOR', $headers) && filter_var($headers['HTTP_X_FORWARDED_FOR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
    $remote_address = $headers['HTTP_X_FORWARDED_FOR'];
} else {
    $remote_address = filter_var(@$_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4);
}

if (!stristr($remote_address, '127.0.0.1')
    && !stristr($remote_address, '::1')
    && !stristr($remote_address, '172.')
    && !stristr($remote_address, '192.')) {
    die('You are not allowed to access this file.');
}

defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'test');

require(__DIR__ . '/../vendor/autoload.php');
require(__DIR__ . '/../vendor/yiisoft/yii2/Yii.php');

$config = require(__DIR__ . '/../config/test.php');

(new yii\web\Application($config))->run();
