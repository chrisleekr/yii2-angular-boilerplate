<?php

namespace app\models;

use Yii;
use yii\behaviors\TimestampBehavior;

/**
 * This is the model class for table "setting".
 *
 * @property integer $id
 * @property string $meta_key
 * @property string $meta_name
 * @property string $meta_type
 * @property string $meta_desc
 * @property string $meta_attribute
 * @property string $meta_value
 * @property integer $is_public
 * @property integer $status
 * @property string $created_at
 * @property string $updated_at
 */
class Setting extends \yii\db\ActiveRecord
{
    const SETTING_PUBLIC = 1;
    const SETTING_PRIVATE = 0;
    const STATUS_ACTIVE = 1;
    const STATUS_DISABLED = 0;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'setting';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [

            [['created_at', 'updated_at'], 'safe'],
            [['meta_key'], 'string', 'max' => 255],
            [['meta_key'], 'unique'],

            ['meta_type', 'in', 'range' => ['select', 'number', 'text']],

            [['meta_key', 'meta_value', 'meta_name', 'meta_type'], 'required'],
            [['meta_desc', 'meta_attribute'], 'safe'],
            [['meta_attribute', 'meta_value'], 'string'],

            ['is_public', 'default', 'value' => self::SETTING_PUBLIC],
            ['is_public', 'in', 'range' => [self::SETTING_PUBLIC, self::SETTING_PRIVATE]],

            ['status', 'default', 'value' => self::STATUS_ACTIVE],
            ['status', 'in', 'range' => [self::STATUS_ACTIVE, self::STATUS_DISABLED]],

        ];
    }

    /** @inheritdoc */
    public function behaviors()
    {
        // TimestampBehavior also provides a method named touch() that allows you to assign the current timestamp to the specified attribute(s) and save them to the database. For example,
        // $model->touch('confirmed_at');
        // $model->touch('last_login_at');
        // $model->touch('blocked_at');
        return [
            [
                'class' => TimestampBehavior::className(),
                'createdAtAttribute' => 'created_at',
                'updatedAtAttribute' => 'updated_at',
                'value' => time()
            ]
        ];
    }

    // explicitly list every field, best used when you want to make sure the changes
    // in your DB table or model attributes do not cause your field changes (to keep API backward compatibility).
    public function fields()
    {
        return [
            'id',
            'meta_key',
            'meta_name',
            'meta_type',
            'meta_desc',
            'meta_attribute',
            'meta_value',
            'is_public',
            'status',
            'updated_at',
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('app', 'ID'),
            'meta_key' => Yii::t('app', 'Meta Key'),
            'meta_name' => Yii::t('app', 'Meta Name'),
            'meta_type' => Yii::t('app', 'Meta Type'),
            'meta_desc' => Yii::t('app', 'Meta Description'),
            'meta_attribute' => Yii::t('app', 'Meta Attribute'),
            'meta_value' => Yii::t('app', 'Meta Value'),
            'is_public' => Yii::t('app', 'Public'),
            'status' => Yii::t('app', 'Status'),
            'created_at' => Yii::t('app', 'Created At'),
            'updated_at' => Yii::t('app', 'Updated At'),
        ];
    }
}
