<?php

namespace app\models;

use Yii;
use yii\base\Model;

/**
 * Signup form
 */
class SignupForm extends Model
{
    public $username;
    public $email;
    public $password;
    /** @var User */
    private $_user = false;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['username', 'trim'],
            ['username', 'required'],
            [
                'username',
                'unique',
                'targetClass' => '\app\models\User',
                'message' => Yii::t('app', 'This username has already been taken.')
            ],
            ['username', 'string', 'length' => [3, 25]],
            [
                'username',
                'match',
                'pattern' => '/^[A-Za-z0-9_-]{3,25}$/',
                'message' => Yii::t(
                    'app',
                    'Your username can only contain alphanumeric characters, underscores and dashes.'
                )
            ],
            ['email', 'trim'],
            ['email', 'required'],
            ['email', 'email'],
            ['email', 'string', 'max' => 255],
            [
                'email',
                'unique',
                'targetClass' => '\app\models\User',
                'message' => Yii::t('app', 'This email address has already been taken.')
            ],

            ['password', 'required'],
            ['password', 'string', 'min' => 6],
        ];
    }

    /**
     * Signs user up.
     *
     * @return boolean the saved model or null if saving fails
     */
    public function signup()
    {
        if ($this->validate()) {
            $user = new User();
            $user->username = strtolower($this->username);
            $user->email = $this->email;
            $user->unconfirmed_email = $this->email;
            $user->role = User::ROLE_USER;
            $user->status = User::STATUS_PENDING;
            $user->setPassword($this->password);
            $user->generateAuthKey();

            $user->registration_ip = Yii::$app->request->userIP;

            if ($user->save(false)) {
                $this->_user = $user;
                return true;
            }

            return false;
        }
        return false;
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

    /**
     * Send confirmation email
     *
     * @return bool
     */
    public function sendConfirmationEmail()
    {
        $confirmURL = \Yii::$app->params['frontendURL'] . '#/confirm?id=' . $this->_user->id . '&auth_key=' . $this->_user->auth_key;

        $email = \Yii::$app->mailer
            ->compose(
                ['html' => 'signup-confirmation-html'],
                [
                    'appName' => \Yii::$app->name,
                    'confirmURL' => $confirmURL,
                ]
            )
            ->setTo($this->email)
            ->setFrom([\Yii::$app->params['supportEmail'] => \Yii::$app->name])
            ->setSubject('Signup confirmation')
            ->send();

        return $email;
    }
}
