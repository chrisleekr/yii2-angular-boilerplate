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
            'id'            => $this->primaryKey(),
            'username'      => $this->string(200),
            'auth_key'      => $this->string(255),
            'access_token_expired_at'   => Schema::TYPE_TIMESTAMP. ' NULL DEFAULT NULL',
            'password_hash'             => $this->string(255),
            'password_reset_token'      => $this->string(255),
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
            ['username', 'auth_key', 'password_hash', 'status']
        );

        $this->batchInsert('user', ['id', 'username', 'auth_key', 'access_token_expired_at', 'password_hash', 'password_reset_token', 'email', 'unconfirmed_email', 'confirmed_at', 'registration_ip', 'last_login_at', 'last_login_ip', 'blocked_at', 'status', 'role', 'created_at', 'updated_at'], [
	        [1, 'admin', 'dVN8fzR_KzJ_lBrymfXI6qyH2QzyXYUU', '2017-06-04 00:13:29', '$2y$13$9Gouh1ZbewVEh4bQIGsifOs8/RWW/7RIs0CAGNd7tapXFm9.WxiXS', NULL, 'admin@demo.com', 'admin@demo.com', '2017-05-05 16:38:48', '127.0.0.1', '2017-06-03 00:13:29', '127.0.0.1', NULL, 10, 99, '2017-05-05 16:38:03', '2017-06-03 00:13:26'],
			[2, 'staff', 'Xm-zZRREtAIKsFlINVRLSw3U7llbx_5a', '2017-05-30 20:30:31', '$2y$13$TKh5pEy0RFTmkC9Kjvb9A.WR/I1QVzYHdfYDw0m7MnHnN0bsv96Jq', NULL, 'staff@demo.com', 'staff@demo.com', '2017-05-15 09:20:53', '127.0.0.1', '2017-05-29 20:30:31', '127.0.0.1', NULL, 10, 50, '2017-05-15 09:19:02', '2017-05-29 20:30:29'],
			[3, 'user', 'rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8', '2017-06-04 00:13:02', '$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm', NULL, 'user@demo.com', 'user@demo.com', '2017-06-03 00:12:16', '127.0.0.1', '2017-06-03 00:13:02', '127.0.0.1', NULL, 10, 10, '2017-05-21 23:31:53', '2017-06-03 13:34:52'],
        ]);
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
