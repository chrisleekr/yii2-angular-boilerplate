<?php
$webConfig = require(__DIR__ . '/web.php');
$dbParams = require(__DIR__ . '/test_db.php');


/**
 * Application configuration shared by all test types
 */
 $webConfig['id'] = 'basic-test';
 $webConfig['components']['db'] = $dbParams;

// configuration adjustments for 'dev' environment
$webConfig['bootstrap'][] = 'debug';
$webConfig['modules']['debug'] = [
	'class' => 'yii\debug\Module',
];

 return $webConfig;
