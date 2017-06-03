<?php

namespace app\models;
use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;
use Firebase\JWT\JWT;
use yii\rbac\Permission;
use yii\web\Request as WebRequest;

/**
 * Class User
 *
 * @property integer $id
 * @property string $username
 * @property string $auth_key
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

	const ROLE_USER = 10;
	const ROLE_STAFF = 50;
	const ROLE_ADMIN = 99;

    const STATUS_DELETED = -1;
    const STATUS_DISABLED = 0;
    const STATUS_PENDING = 1;
    const STATUS_ACTIVE = 10;

    /** @var  string to store JSON web token */
    public $access_token;

    /** @var  array $permissions to store list of permissions */
    public $permissions;

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
        $fields = [
            'id',
            'username',
            'email',
            'unconfirmed_email',
            'role',
            'role_label'    =>  function() {
                return $this->getRoleLabel();
            },
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
                    case self::STATUS_DISABLED:
                        $statusLabel = Yii::t('app', 'Disabled');
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

		// If role is staff and admin, then return permissions
	    if($this->role == self::ROLE_STAFF || $this->role == self::ROLE_ADMIN) {
		    $fields['permissions'] = function(){
			    $authManager = Yii::$app->authManager;

			    /** @var Permission[] $availablePermissions */
			    $availablePermissions = $authManager->getPermissions();


			    /** @var array $tmpPermissions to store permissions assigned to the staff*/
                $tmpPermissions = [];
    			/** @var Permission[] $userPermissions */
			    $userPermissions = $authManager->getPermissionsByUser($this->getId());
    			if(!empty($availablePermissions)) {
    				/**
    				 * @var string $permissionKey
    				 * @var Permission $permission
    				 */
    				foreach($availablePermissions as $permissionKey => $permission) {
    					$tmpPermission = [
    						'name'          =>  $permission->name,
    						'description'   =>  $permission->description,
    						'checked'       =>  false,
    					];

    					if(!empty($userPermissions)) {
    					    foreach($userPermissions as $userPermissionKey => $userPermission) {
    					        if($userPermission->name == $permission->name) {
						            $tmpPermission['checked'] = true;
						            break;
    					        }
    					    }
    					}

    					$tmpPermissions[] = $tmpPermission;
    				}
    			}

			    return $tmpPermissions;
		    };
	    }


	    return $fields;
    }

    private function getRoleName(){
	    $roleName = '';
	    switch($this->role) {
		    case self::ROLE_USER:
			    $roleName = 'user';
			    break;
		    case self::ROLE_STAFF:
			    $roleName = 'staff';
			    break;
		    case self::ROLE_ADMIN:
			    $roleName = 'admin';
			    break;
	    }
	    return $roleName;
    }

	private function getRoleLabel(){
		$roleLabel = '';
		switch($this->role) {
			case self::ROLE_USER:
				$roleLabel = Yii::t('app', 'User');
				break;
			case self::ROLE_STAFF:
				$roleLabel = Yii::t('app', 'Staff');
				break;
			case self::ROLE_ADMIN:
				$roleLabel = Yii::t('app', 'Administrator');
				break;
		}
		return $roleLabel;
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
            ['status', 'in', 'range' => [self::STATUS_ACTIVE, self::STATUS_DISABLED]],

            ['role', 'default', 'value' => self::ROLE_USER],
            ['role', 'in', 'range' => [self::ROLE_USER, self::ROLE_STAFF, self::ROLE_ADMIN]],

			['permissions', 'validatePermissions'],
            [['access_token', 'permissions'], 'safe'],
        ];
    }

	/**
	 * Validate whether password is submitted or not
	 *  Only required to submit the password on creation
	 *
	 * @param $attribute
	 * @param $params
	 */
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

	/**
	 * Validate permissions array
	 *
	 * @param $attribute
	 * @param $params
	 */
    public function validatePermissions($attribute, $params) {

        if(!empty($this->$attribute)) {

	        $authManager = Yii::$app->authManager;
	        // Get existing permissions
	        $existingPermissions = $authManager->getPermissions();

	        // Loop attributes
            foreach($this->$attribute as $permissionKey => $permission) {
                // Validate attributes in the array
				if(array_key_exists('name', $permission) === false ||
					array_key_exists('description', $permission) === false ||
					array_key_exists('checked', $permission) === false) {
					$this->addError($attribute, Yii::t('app', 'The permission is not valid format.'));
				}
				// Validate name
				elseif(isset($existingPermissions[$permission['name']]) == false) {
					$this->addError($attribute, Yii::t('app', 'The permission name \''.$permission['name'].'\' is not valid.'));
				}
	            // Validate checked
	            elseif(is_bool($permission['checked']) === false) {
		            $this->addError($attribute, Yii::t('app', 'The permission checked \''.$permission['checked'].'\' is not valid.'));
	            }
            }
        }
    }

	/**
	 * Validate username
	 *
	 * @param $attribute
	 * @param $params
	 */
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

	/**
	 * Validate email
	 *
	 * @param $attribute
	 * @param $params
	 */
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
	 * Finds user by username
	 *
	 * @param string $usernamet
	 * @param array $roles
	 * @return static|null
	 */
	public static function findByUsernameWithRoles($username, $roles)
	{
		/** @var User $user */
		$user = static::find()->where([
			'username'  =>  $username,
			'status'    =>  self::STATUS_ACTIVE,

		])->andWhere(['in', 'role', $roles])->one();


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
            || $this->access_token_expired_at == null
            || (time() > strtotime($this->access_token_expired_at)))
        {
            // generate access token
            $this->generateAccessToken();
        }
        $this->save(false);
        return true;
    }

    public function generateAccessToken(){
        // generate access token
//        $this->access_token = Yii::$app->security->generateRandomString();
		$tokens = $this->getJWT();
	    $this->access_token = $tokens[0];   // Token
        $this->access_token_expired_at = date("Y-m-d H:i:s", $tokens[1]['exp']); // Expire

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

        return parent::beforeSave($insert);
    }

	public function afterSave($insert, $changedAttributes)
	{
		$authManager = Yii::$app->authManager;

		// ---- Start to process role
		// When insert new user, assign new role
		if($insert == true) {
			$roleName = $this->getRoleName();

			$authItem = $authManager->getRole($roleName);
			$authManager->assign($authItem, $this->getId());
		}
		// When update existing user, revoke old role and assign new role
		else {
			if(isset($changedAttributes['role']) === true) {
				// Get role name
				$roleName = $this->getRoleName();
				$authManager->revokeAll($this->getId());
				$authItem = $authManager->getRole($roleName);
				$authManager->assign($authItem, $this->getId());
			}
		}
		// ---- Finish to process role

		// ---- Start to process permissions
		if(!empty($this->permissions)) {
			// permissions only allow to be entered if the role is staff
			if($this->role == self::ROLE_STAFF) {
				$existingPermissions = $authManager->getPermissionsByUser($this->getId());
				foreach($this->permissions as $permissionKey => $permission) {
					if($permission['checked'] == true) {
						// If not assigned, then add to permission
						if(isset($existingPermissions[$permission['name']]) == false) {
							$authItem = $authManager->getPermission($permission['name']);
							$authManager->assign($authItem, $this->getId());
						}
					} else {
						// If assigned already, then remove from permission
						if(isset($existingPermissions[$permission['name']]) == true) {
							$authItem = $authManager->getPermission($permission['name']);
							$authManager->revoke($authItem, $this->getId());
						}
					}
				}
			} else {
				// if role is changed and remove all
				$existingPermissions = $authManager->getPermissionsByUser($this->getId());
				if(!empty($existingPermissions)) {
					foreach($existingPermissions as $permissionName => $permission) {
						$authItem = $authManager->getPermission($permissionName);
						$authManager->revoke($authItem, $this->getId());
					}
				}
			}
		}

		// ---- Start to process permissions
		return parent::afterSave($insert, $changedAttributes);

	}

    public function getPassword()
    {
        return '';
    }


	/*
	 * JWT Related Functions
	 */

	/**
	 * Store JWT token header items.
	 * @var array
	 */
	protected static $decodedToken;

	protected static function getSecretKey()
	{
		return Yii::$app->params['jwtSecretCode'];
	}

	// And this one if you wish
	protected static function getHeaderToken()
	{
		return [];
	}


	/**
	 * Logins user by given JWT encoded string. If string is correctly decoded
	 * - array (token) must contain 'jti' param - the id of existing user
	 * @param  string $accessToken access token to decode
	 * @return mixed|null          User model or null if there's no user
	 * @throws \yii\web\ForbiddenHttpException if anything went wrong
	 */
	public static function findIdentityByAccessToken($token, $type = null)
	{
		$secret = static::getSecretKey();
		// Decode token and transform it into array.
		// Firebase\JWT\JWT throws exception if token can not be decoded
		try {
			$decoded = JWT::decode($token, $secret, [static::getAlgo()]);
		} catch (\Exception $e) {
			return false;
		}
		static::$decodedToken = (array) $decoded;
		// If there's no jti param - exception
		if (!isset(static::$decodedToken['jti'])) {
			return false;
		}
		// JTI is unique identifier of user.
		// For more details: https://tools.ietf.org/html/rfc7519#section-4.1.7
		$id = static::$decodedToken['jti'];
		return static::findByJTI($id);
	}

	/**
	 * Finds User model using static method findOne
	 * Override this method in model if you need to complicate id-management
	 * @param  string $id if of user to search
	 * @return mixed       User model
	 */
	public static function findByJTI($id)
	{
		/** @var User $user */
		$user = static::find()->where([
			'=', 'id', $id
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
	 * Getter for encryption algorytm used in JWT generation and decoding
	 * Override this method to set up other algorytm.
	 * @return string needed algorytm
	 */
	public static function getAlgo()
	{
		return 'HS256';
	}

	/**
	 * Returns some 'id' to encode to token. By default is current model id.
	 * If you override this method, be sure that findByJTI is updated too
	 * @return integer any unique integer identifier of user
	 */
	public function getJTI()
	{
		return $this->getId();
	}

	/**
	 * Encodes model data to create custom JWT with model.id set in it
	 * @return array encoded JWT
	 */
	public function getJWT()
	{
		// Collect all the data
		$secret      = static::getSecretKey();
		$currentTime = time();
		$expire      = $currentTime + 86400; // 1 day
		$request     = Yii::$app->request;
		$hostInfo    = '';
		// There is also a \yii\console\Request that doesn't have this property
		if ($request instanceof WebRequest) {
			$hostInfo = $request->hostInfo;
		}

		// Merge token with presets not to miss any params in custom
		// configuration
		$token = array_merge([
			'iat' => $currentTime,      // Issued at: timestamp of token issuing.
			'iss' => $hostInfo,         // Issuer: A string containing the name or identifier of the issuer application. Can be a domain name and can be used to discard tokens from other applications.
			'aud' => $hostInfo,
			'nbf' => $currentTime,       // Not Before: Timestamp of when the token should start being considered valid. Should be equal to or greater than iat. In this case, the token will begin to be valid 10 seconds
			'exp' => $expire,           // Expire: Timestamp of when the token should cease to be valid. Should be greater than iat and nbf. In this case, the token will expire 60 seconds after being issued.
			'data' => [
				'username'      =>  $this->username,
				'roleLabel'    =>  $this->getRoleLabel(),
				'lastLoginAt'   =>  $this->last_login_at,
			]
		], static::getHeaderToken());
		// Set up id
		$token['jti'] = $this->getJTI();    // JSON Token ID: A unique string, could be used to validate a token, but goes against not having a centralized issuer authority.
		return [JWT::encode($token, $secret, static::getAlgo()), $token];
	}

}
