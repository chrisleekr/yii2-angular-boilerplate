<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `user`.
 */
class m170125_082006_create_user_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('user', [
            'id' => $this->primaryKey(),
            'username'      => $this->string(200),
            'auth_key'      => $this->string(255),
            'access_token'  => $this->string(255),
            'access_token_expired_at'  => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',
            'password_hash' => $this->string(255),
            'password_reset_token' => $this->string(255),
            'email'             => $this->string(255),

            'unconfirmed_email' =>  $this->string(255),
            'confirmed_at'      => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',
            'registration_ip'   => $this->string(20),
            'last_login_at'     => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',
            'last_login_ip'     => $this->string(20),
            'blocked_at'        => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',

            'status'            => $this->integer(2)->defaultValue(10),
            'role'              => $this->integer(11)->null(),
            'created_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP',
            'updated_at'        => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        // creates index for table
        $this->createIndex(
            'idx-user',
            'user',
            ['username', 'auth_key', 'access_token', 'password_hash', 'status']
        );
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropIndex('idx-user', 'user');

        $this->dropTable('user');
    }
}
