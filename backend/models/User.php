<?php

namespace app\models;
use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;

/**
 * Class User
 *
 * @property integer $id
 * @property string $username
 * @property string $auth_key
 * @property string $access_token
 * @property integer $access_token_expired_at
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $email
 * @property string $unconfirmed_email
 * @property integer $confirmed_at
 * @property string $registration_ip
 * @property integer $last_login_at
 * @property string $last_login_ip
 * @property integer $blocked_at
 * @property boolean $status
 * @property integer $role
 * @property integer $created_at
 * @property integer $updated_at
 *
 * @package app\models
 */
class User extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface
{

    //public $password = '';

    const STATUS_DELETED = 0;
    const STATUS_PENDING = 1;
    const STATUS_ACTIVE = 10;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user';
    }


    /** @inheritdoc */
    public function attributeLabels()
    {
        return [
            'username'          => Yii::t('app', 'Username'),
            'email'             => Yii::t('app', 'Email'),
            'registration_ip'   => Yii::t('app', 'Registration ip'),
            'unconfirmed_email' => Yii::t('app', 'New email'),
            'password'          => Yii::t('app', 'Password'),
            'created_at'        => Yii::t('app', 'Registration time'),
            'confirmed_at'      => Yii::t('app', 'Confirmation time'),
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
                'class' =>  TimestampBehavior::className(),
                'createdAtAttribute' => 'created_at',
                'updatedAtAttribute' => 'updated_at',
                'value' => date('Y-m-d H:i:s')
            ]
        ];
    }

    // explicitly list every field, best used when you want to make sure the changes
    // in your DB table or model attributes do not cause your field changes (to keep API backward compatibility).
    public function fields()
    {
        return [
            'id',
            'username',
            'email',
            'unconfirmed_email',
            'last_login_at',
            'last_login_ip',
            'confirmed_at',
            'blocked_at',
            'status',
            'status_label'  =>  function(){
                $statusLabel = '';
                switch($this->status) {
                    case self::STATUS_ACTIVE:
                        $statusLabel = Yii::t('app', 'Active');
                        break;
                    case self::STATUS_PENDING:
                        $statusLabel = Yii::t('app', 'Waiting Confirmation');
                        break;
                    case self::STATUS_DELETED:
                        $statusLabel = Yii::t('app', 'Deleted');
                        break;
                }
                return $statusLabel;
            },
            'created_at',
            'updated_at',
        ];
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['username', 'trim'],
            ['username', 'required'],
            ['username', 'string', 'length' => [3, 15]],
            ['username', 'match', 'pattern' => '/^[A-Za-z0-9_-]{3,15}$/', 'message' => Yii::t('app', 'Your username can only contain alphanumeric characters, underscores and dashes.')],
            ['username', 'validateUsername'],
            ['email', 'trim'],
            ['email', 'required'],
            ['email', 'email'],
            ['email', 'string', 'max' => 255],
            ['email', 'validateEmail'],
            ['password', 'string', 'min' => 6],
            ['password', 'validatePasswordSubmit'],
            [['confirmed_at', 'blocked_at', 'last_login_at'], 'date', 'format' => 'yyyy-M-d H:m:s'],
            [['last_login_ip', 'registration_ip'], 'ip'],
            ['status', 'default', 'value' => self::STATUS_ACTIVE],
            ['status', 'in', 'range' => [self::STATUS_ACTIVE, self::STATUS_DELETED]],
        ];
    }

    public function validatePasswordSubmit($attribute, $params) {
        // get post type - POST or PUT
        $request = Yii::$app->request;

        // if POST, mode is create
        if($request->isPost) {
            if($this->$attribute == '') {
                $this->addError($attribute, Yii::t('app', 'The password is required.'));
            }
        } elseif($request->isPut) {
            // No action required
        }
    }

    public function validateUsername($attribute, $params) {
        // get post type - POST or PUT
        $request = Yii::$app->request;

        // if POST, mode is create
        if($request->isPost) {
            // check username is already taken

            $existingUser = User::find()
                ->where(['username' => $this->$attribute])
                ->count();
            if($existingUser > 0) {
                $this->addError($attribute, Yii::t('app', 'The username has already been taken.'));
            }

        } elseif($request->isPut) {
            // get current user
            $user = User::findIdentityWithoutValidation($this->id);
            if($user == null) {
                $this->addError($attribute, Yii::t('app', 'The system cannot find requested user.'));
            } else {
                // check username is already taken except own username
                $existingUser = User::find()
                    ->where(['=', 'username', $this->$attribute])
                    ->andWhere(['!=', 'id', $this->id])
                    ->count();
                if($existingUser > 0) {
                    $this->addError($attribute, Yii::t('app', 'The username has already been taken.'));
                }
            }
        } else {
            // unknown request
            $this->addError($attribute, Yii::t('app', 'Unknown request'));
        }
    }
    public function validateEmail($attribute, $params) {
        // get post type - POST or PUT
        $request = Yii::$app->request;

        // if POST, mode is create
        if($request->isPost) {
            // check username is already taken

            $existingUser = User::find()
                ->where(['email' => $this->$attribute])
                ->count();

            if($existingUser > 0) {
                $this->addError($attribute, Yii::t('app', 'The email has already been taken.'));
            }

        } elseif($request->isPut) {
            // get current user
            $user = User::findIdentityWithoutValidation($this->id);

            if($user == null) {
                $this->addError($attribute, Yii::t('app', 'The system cannot find requested user.'));
            } else {
                // check username is already taken except own username
                $existingUser = User::find()
                    ->where(['=', 'email', $this->$attribute])
                    ->andWhere(['!=', 'id', $this->id])
                    ->count();
                if($existingUser > 0) {
                    $this->addError($attribute, Yii::t('app', 'The email has already been taken.'));
                }
            }
        } else {
            // unknown request
            $this->addError($attribute, Yii::t('app', 'Unknown request'));
        }
    }


    /**
     * @return bool Whether the user is confirmed or not.
     */
    public function getIsConfirmed()
    {
        return $this->confirmed_at != null;
    }

    /**
     * @return bool Whether the user is blocked or not.
     */
    public function getIsBlocked()
    {
        return $this->blocked_at != null;
    }


    /**
     * @inheritdoc
     */
    public static function findIdentity($id)
    {
        $user = static::findOne(['id' => $id, 'status' => self::STATUS_ACTIVE]);
        if($user !== null &&
            ($user->getIsBlocked() == true || $user->getIsConfirmed() == false)) {
            return null;
        }
        return $user;
    }

    public static function findIdentityWithoutValidation($id){
        $user = static::findOne(['id' => $id]);

        return $user;
    }

    /**
     * @inheritdoc
     */
    public static function findIdentityByAccessToken($token, $type = null)
    {
        /** @var User $user */
        $user = static::find()->where([
            '=', 'access_token', $token
        ])
        ->andWhere([
            '=', 'status',  self::STATUS_ACTIVE
        ])
        ->andWhere([
            '>', 'access_token_expired_at', new Expression('NOW()')
        ])->one();
        if($user !== null &&
            ($user->getIsBlocked() == true || $user->getIsConfirmed() == false)) {
            return null;
        }
        return $user;
    }

    /**
     * Finds user by username
     *
     * @param string $username
     * @return static|null
     */
    public static function findByUsername($username)
    {

        $user = static::findOne(['username' => $username, 'status' => self::STATUS_ACTIVE]);
        if($user !== null &&
            ($user->getIsBlocked() == true || $user->getIsConfirmed() == false)) {
            return null;
        }

        return $user;
    }

    /**
     * Finds user by password reset token
     *
     * @param string $token password reset token
     * @return static|null
     */
    public static function findByPasswordResetToken($token)
    {
        if (!static::isPasswordResetTokenValid($token)) {
            return null;
        }
        return static::findOne([
            'password_reset_token' => $token,
            'status' => self::STATUS_ACTIVE,
        ]);
    }
    /**
     * Finds out if password reset token is valid
     *
     * @param string $token password reset token
     * @return bool
     */
    public static function isPasswordResetTokenValid($token)
    {
        if (empty($token)) {
            return false;
        }
        $timestamp = (int) substr($token, strrpos($token, '_') + 1);
        $expire = Yii::$app->params['user.passwordResetTokenExpire'];
        return $timestamp + $expire >= time();
    }


    /**
     * @inheritdoc
     */
    public function getId()
    {
        return $this->getPrimaryKey();
    }

    /**
     * @inheritdoc
     */
    public function getAuthKey()
    {
        return $this->authKey;
    }

    /**
     * @inheritdoc
     */
    public function validateAuthKey($authKey)
    {
        return $this->getAuthKey() === $authKey;
    }
    /**
     * Validates password
     *
     * @param string $password password to validate
     * @return bool if password provided is valid for current user
     */
    public function validatePassword($password)
    {
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }

    /**
     * Generates password hash from password and sets it to the model
     *
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }
    /**
     * Generates "remember me" authentication key
     */
    public function generateAuthKey()
    {
        $this->auth_key = Yii::$app->security->generateRandomString();
    }
    /**
     * Generates new password reset token
     */
    public function generatePasswordResetToken()
    {
        $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
    }
    /**
     * Removes password reset token
     */
    public function removePasswordResetToken()
    {
        $this->password_reset_token = null;
    }

    /**
     * Confirm Email address
     *      Not implemented Yet
     *
     * @return bool whether the email is confirmed o not
     */
    public function confirmEmail() {
        if($this->unconfirmed_email != '') {
            $this->email = $this->unconfirmed_email;
        }
        $this->registration_ip = Yii::$app->request->userIP;
        $this->status = self::STATUS_ACTIVE;
        $this->save(false);
        $this->touch('confirmed_at');

        return true;
    }

    /**
     * Generate access token
     *  This function will be called every on request to refresh access token.
     *
     * @param bool $forceRegenerate whether regenerate access token even if not expired
     *
     * @return bool whether the access token is generated or not
     */
    public function generateAccessTokenAfterUpdatingClientInfo($forceRegenerate=false)
    {
        // update client login, ip
        $this->last_login_ip = Yii::$app->request->userIP;
        $this->last_login_at = new Expression('NOW()');

        // check time is expired or not
        if($forceRegenerate == true
            || $this->access_token == ''
            || $this->access_token_expired_at == null
            || (time() > $this->access_token_expired_at))
        {
            // generate access token
            $this->generateAccessToken();
        }
        $this->save(false);
        return true;
    }

    public function generateAccessToken(){
        // generate access token
        $this->access_token = Yii::$app->security->generateRandomString();
        $this->access_token_expired_at = new Expression('DATE_ADD(NOW(), INTERVAL 5 DAY)');
    }

    public function beforeSave($insert)
    {
        // Convert username to lower case
        $this->username = strtolower($this->username);

        // Fill unconfirmed email field with email if empty
        if($this->unconfirmed_email == '') {
            $this->unconfirmed_email = $this->email;
        }

        // Fill registration ip with current ip address if empty
        if($this->registration_ip == '') {
            $this->registration_ip = Yii::$app->request->userIP;
        }

        // Fill auth key if empty
        if($this->auth_key == '') {
            $this->generateAuthKey();
        }

        // Fill access token if empty
        if($this->access_token == '') {
            $this->generateAccessToken();
        }

        // If password is empty, use user
//        if($this->password == '' && $this->id != '') {
//            $user = User::findIdentityWithoutValidation($this->id);
//            if($user != null) {
//                $this->
//            }
//        }


        return parent::beforeSave($insert); // TODO: Change the autogenerated stub
    }

    public function getPassword()
    {
        return '';
    }



}
