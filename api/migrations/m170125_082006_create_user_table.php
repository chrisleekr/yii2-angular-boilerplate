<?php

use yii\db\Migration;

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
            'username' => $this->string(200),
            'auth_key' => $this->string(255),
            'access_token_expired_at' => $this->integer(11) . ' NULL DEFAULT NULL',
            'password_hash' => $this->string(255),
            'password_reset_token' => $this->string(255),
            'email' => $this->string(255),
            'unconfirmed_email' => $this->string(255),
            'confirmed_at' => $this->integer(11) . ' NULL DEFAULT NULL',
            'registration_ip' => $this->string(20),
            'last_login_at' => $this->integer(11) . ' NULL DEFAULT NULL',
            'last_login_ip' => $this->string(20),
            'blocked_at' => $this->integer(11) . ' NULL DEFAULT NULL',
            'status' => $this->integer(2)->defaultValue(10),
            'role' => $this->integer(11)->null(),
            'created_at' => $this->integer(11) . ' NULL DEFAULT NULL',
            'updated_at' => $this->integer(11) . ' NULL DEFAULT NULL'
        ]);

        // creates index for table
        $this->createIndex(
            'idx-user',
            'user',
            ['username', 'auth_key', 'password_hash', 'status']
        );

        $this->batchInsert('user', [
            'id',
            'username',
            'auth_key',
            'access_token_expired_at',
            'password_hash',
            'password_reset_token',
            'email',
            'unconfirmed_email',
            'confirmed_at',
            'registration_ip',
            'last_login_at',
            'last_login_ip',
            'blocked_at',
            'status',
            'role',
            'created_at',
            'updated_at'
        ], [
            [
                1,
                'admin',
                'dVN8fzR_KzJ_lBrymfXI6qyH2QzyXYUU',
                '2017-06-04 00:13:29',
                '$2y$13$9Gouh1ZbewVEh4bQIGsifOs8/RWW/7RIs0CAGNd7tapXFm9.WxiXS',
                null,
                'admin@demo.com',
                'admin@demo.com',
                time(),
                '127.0.0.1',
                time(),
                '127.0.0.1',
                null,
                10,
                99,
                time(),
                time()
            ],
            [
                2,
                'staff',
                'Xm-zZRREtAIKsFlINVRLSw3U7llbx_5a',
                '2017-05-30 20:30:31',
                '$2y$13$TKh5pEy0RFTmkC9Kjvb9A.WR/I1QVzYHdfYDw0m7MnHnN0bsv96Jq',
                null,
                'staff@demo.com',
                'staff@demo.com',
                time(),
                '127.0.0.1',
                time(),
                '127.0.0.1',
                null,
                10,
                50,
                time(),
                time()
            ],
            [
                3,
                'user',
                'rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',
                '2017-06-04 00:13:02',
                '$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',
                null,
                'user@demo.com',
                'user@demo.com',
                time(),
                '127.0.0.1',
                time(),
                '127.0.0.1',
                null,
                10,
                10,
                time(),
                time()
            ],
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
