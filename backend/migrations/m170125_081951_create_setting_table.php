<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `setting`.
 */
class m170125_081951_create_setting_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('setting', [
            'id'            => $this->primaryKey(),
            'meta_key'      => $this->string(255),
            'meta_name'     => $this->string(255),
            'meta_type'     => $this->string(50),
            'meta_desc'     => $this->text(),
            'meta_attribute'=> $this->text(),

            'meta_value'    => 'LONGTEXT',
            'is_public'     => $this->boolean(),
            'status'        => $this->boolean(),
            'created_at'    => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP',
            'updated_at'    => Schema::TYPE_TIMESTAMP. ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ]);

        // creates index for table `setting`
        $this->createIndex(
            'idx-setting',
            'setting',
            ['meta_key', 'meta_type', 'is_public', 'status', 'created_at', 'updated_at']
        );



        $this->insert('setting', [
            'id'            =>  1,
            'meta_key'      =>  'timezone',
            'meta_name'     =>  'Timezone',
            'meta_type'     =>  'select',
            'meta_desc'     =>  'Set the time zone of the application',
            'meta_attribute'    =>  '{"list":[{"value":"Australia/Adelaide","label":"Australia/Adelaide"},{"value":"Australia/Brisbane","label":"Australia/Brisbane"},{"value":"Australia/Canberra","label":"Australia/Canberra"},{"value":"Australia/Hobart","label":"Australia/Hobart"},{"value":"Australia/Melbourne","label":"Australia/Melbourne"},{"value":"Australia/Perth","label":"Australia/Perth"},{"value":"Australia/Sydney","label":"Australia/Sydney"}]}',
            'meta_value'    =>  'Australia/Melbourne',
            'is_public'     =>  1,
            'status'        =>  1,
        ]);

        $this->insert('setting', [
            'id'            =>  2,
            'meta_key'      =>  'test_setting1',
            'meta_name'     =>  'Test Setting1',
            'meta_type'     =>  'number',
            'meta_desc'     =>  'Test Setting Description',
            'meta_attribute'=>  '',
            'meta_value'    =>  '15',
            'is_public'     =>  1,
            'status'        =>  1,
        ]);

        $this->insert('setting', [
            'id'            =>  3,
            'meta_key'      =>  'test_setting2',
            'meta_name'     =>  'Test Setting2',
            'meta_type'     =>  'text',
            'meta_desc'     =>  'Test Setting Description',
            'meta_attribute'=>  '',
            'meta_value'    =>  'value',
            'is_public'     =>  1,
            'status'        =>  1,
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropIndex('idx-setting', 'setting');
        $this->dropTable('setting');
    }
}
