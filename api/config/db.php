<?php

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=' . getenv('MYSQL_HOST')
        . ';port=' . getenv('MYSQL_PORT')
        . ';dbname=' . getenv('MYSQL_DATABASE'),
    'username' => getenv('MYSQL_USERNAME'),
    'password' => getenv('MYSQL_PASSWORD'),
    'charset' => 'utf8',

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];
