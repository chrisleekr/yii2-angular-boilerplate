<?php

namespace app\models;

use yii\base\Model;

/**
 * Signup Confirm form
 */
class SignupConfirmForm extends Model
{
    public $id;
    public $auth_key;
    /** @var User */
    private $_user = false;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'auth_key'], 'trim'],
            [['id', 'auth_key'], 'required'],
            [
                'id',
                'exist',
                'targetClass' => '\app\models\User',
                'filter' => [
                    'and',
                    ['status' => User::STATUS_PENDING],
                    'confirmed_at IS NULL',
                ],
                'message' => 'The ID is not valid.'
            ],
            ['auth_key', 'string', 'length' => 32],

            [
                'auth_key',
                'exist',
                'targetClass' => '\app\models\User',
                'message' => 'The auth key is not valid.',
                'filter' => function ($query) {
                    $query->andWhere(['status' => User::STATUS_PENDING])
                        ->andWhere(['id' => $this->id])
                        ->andWhere('confirmed_at IS NULL');
                }
            ]
        ];
    }

    /**
     * Signs user up.
     *
     * @return boolean the saved model or null if saving fails
     */
    public function confirm()
    {
        if ($this->validate()) {
            $this->getUserByID();

            // fill confirmed_at
            $this->_user->confirmEmail();

            // generate access token
            $this->_user->generateAccessTokenAfterUpdatingClientInfo(true);

            // Send confirmation email
            $this->sendSignupSuccessEmail();

            return true;
        }
        return false;
    }

    /**
     * Finds user by [[id]]
     *
     * @return User|null
     */
    public function getUserByID()
    {
        if ($this->_user === false) {
            $this->_user = User::findOne($this->id);
        }

        return $this->_user;
    }

    public function sendSignupSuccessEmail()
    {
        $loginURL = \Yii::$app->params['frontendURL'] . '#/login';

        $email = \Yii::$app->mailer
            ->compose(
                ['html' => 'signup-success-html'],
                [
                    'appName' => \Yii::$app->name,
                    'loginURL' => $loginURL,
                ]
            )
            ->setTo($this->_user->email)
            ->setFrom([\Yii::$app->params['supportEmail'] => \Yii::$app->name])
            ->setSubject('Signup completed')
            ->send();

        return $email;
    }

    /**
     * Return User object
     *
     * @return User
     */
    public function getUser()
    {
        return $this->_user;
    }
}
