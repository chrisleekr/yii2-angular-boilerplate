<?php

use yii\db\Migration;

class m170506_004517_init_rbac extends Migration
{
    public $adminId = 1;
    public $staffId = 2;
    public $userId = 3;

    public function up()
    {
        $auth = Yii::$app->authManager;

        $manageSettings = $auth->createPermission('manageSettings');
        $manageSettings->description = 'Manage settings';
        $auth->add($manageSettings);

        $manageStaffs = $auth->createPermission('manageStaffs');
        $manageStaffs->description = 'Manage staffs';
        $auth->add($manageStaffs);

        $manageUsers = $auth->createPermission('manageUsers');
        $manageUsers->description = 'Manage users';
        $auth->add($manageUsers);

        $user = $auth->createRole('user');
        $user->description = 'User';
        $auth->add($user);

        $staff = $auth->createRole('staff');
        $staff->description = 'Staff';
        $auth->add($staff);

        $admin = $auth->createRole('admin');
        $admin->description = 'Administrator';
        $auth->add($admin);

        $admin = $auth->getRole('admin');
        $staff = $auth->getRole('staff');
        $staffPermissions = $auth->getPermissions();
        $user = $auth->getRole('user');

        // Assign administrator role to admin (1)
        $auth->assign($admin, $this->adminId);

        // Assign staff role to staff (2)
        $auth->assign($staff, $this->staffId);

        // Assign permissions to staff

        if (!empty($staffPermissions)) {
            foreach ($staffPermissions as $key => $permission) {
                $auth->assign($permission, $this->staffId);
            }
        }

        // Assign user role to user (3)
        $auth->assign($user, $this->userId);
    }

    public function down()
    {
        Yii::$app->authManager->removeAll();
    }
    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
