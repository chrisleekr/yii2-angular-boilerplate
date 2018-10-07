<?php
$db = require(__DIR__ . '/db.php');
// test database! Important not to run tests on production or development databases
$db['dsn'] = 'mysql:host=' . getenv('MYSQL_HOST')
    . ';port=' . getenv('MYSQL_PORT')
    . ';dbname=' . getenv('MYSQL_DATABASE');

return $db;
