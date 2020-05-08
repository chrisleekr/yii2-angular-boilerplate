<?php

namespace app\models;

use Yii;
use yii\base\Model;

/**
 * User Edit form
 */
class UserEditForm extends Model
{
    public $id;
    public $password;
    public $email;
    /** @var User */
    private $_user = false;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [
                'id',
                'exist',
                'targetClass' => '\app\models\User',
                'filter' => [
                    'and',
                    ['status' => User::STATUS_ACTIVE],
                    'confirmed_at IS NOT NULL',
                    'blocked_at IS NULL'
                ],
                'message' => 'The ID is not valid.'
            ],
            ['email', 'trim'],
            ['email', 'required'],
            ['email', 'email'],
            ['email', 'string', 'max' => 255],
            [
                'email',
                'unique',
                'targetClass' => '\app\models\User',
                'message' => Yii::t('app', 'This email address has already been taken.'),
                'filter' => function ($query) {
                    $query->andWhere(['!=', 'id', $this->id]);
                }
            ],

            ['password', 'string', 'min' => 6],
        ];
    }

    /**
     * Signs user up.
     *
     * @return boolean the saved model or null if saving fails
     */
    public function save()
    {
        if ($this->validate()) {
            $this->getUserByID();

            // if user email has been changed, then put the email in unconfirmed_email and set confirmed_at as null
            $updateIndicator = false;
            if ($this->_user->email != $this->email) {
                $this->_user->unconfirmed_email = $this->email;
                $this->_user->confirmed_at = null;
                $this->_user->status = User::STATUS_PENDING;
                $this->_user->generateAuthKey();
                $updateIndicator = true;
            }

            // If password is not null, then update password
            if ($this->password != '') {
                $updateIndicator = true;
                $this->_user->setPassword($this->password);
            }

            if ($updateIndicator == true && $this->_user->save(false)) {
                // Send confirmation email
                $this->sendConfirmationEmail();
                return true;
            } elseif ($updateIndicator == false) {
                // Nothing to update
                return true;
            } else {
                $this->addError('generic', Yii::t('app', 'The system could not update the information.'));
            }
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

    public function sendConfirmationEmail()
    {
        $confirmURL = \Yii::$app->params['frontendURL'] . '#/confirm?id=' . $this->_user->id . '&auth_key=' . $this->_user->auth_key;

        $email = \Yii::$app->mailer
            ->compose(
                ['html' => 'email-confirmation-html'],
                [
                    'appName' => \Yii::$app->name,
                    'confirmURL' => $confirmURL,
                ]
            )
            ->setTo($this->email)
            ->setFrom([\Yii::$app->params['supportEmail'] => \Yii::$app->name])
            ->setSubject('Email confirmation')
            ->send();

        return $email;
    }
}
