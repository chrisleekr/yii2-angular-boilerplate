<?php
    namespace app\modules\v1\controllers;

    use app\filters\auth\HttpBearerAuth;
    use Yii;

    use yii\data\ActiveDataProvider;
    use yii\filters\AccessControl;
    use yii\filters\auth\CompositeAuth;
    use yii\helpers\Url;
    use yii\rbac\Permission;
    use yii\rest\ActiveController;

    use yii\web\HttpException;
    use yii\web\NotFoundHttpException;
    use yii\web\ServerErrorHttpException;

    use app\models\User;
    use app\models\LoginForm;

    class StaffController extends ActiveController
    {
        public $modelClass = 'app\models\User';

        public function __construct($id, $module, $config = [])
        {
            parent::__construct($id, $module, $config);

        }

        public function actions()
        {
            return [];
        }

        public function behaviors()
        {
            $behaviors = parent::behaviors();

            $behaviors['authenticator'] = [
                'class' => CompositeAuth::className(),
                'authMethods' => [
                    HttpBearerAuth::className(),
                ],

            ];

            $behaviors['verbs'] = [
                'class' => \yii\filters\VerbFilter::className(),
                'actions' => [
                    'index'  => ['get'],
                    'view'   => ['get'],
                    'create' => ['post'],
                    'update' => ['put'],
                    'delete' => ['delete'],
                    'login'  => ['post'],
                    'getPermissions'    =>  ['get'],
                ],
            ];

            // remove authentication filter
            $auth = $behaviors['authenticator'];
            unset($behaviors['authenticator']);

            // add CORS filter
            $behaviors['corsFilter'] = [
                'class' => \yii\filters\Cors::className(),
                'cors' => [
                    'Origin' => ['*'],
                    'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                    'Access-Control-Request-Headers' => ['*'],
                ],
            ];

            // re-add authentication filter
            $behaviors['authenticator'] = $auth;
            // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
            $behaviors['authenticator']['except'] = ['options', 'login'];


	        // setup access
	        $behaviors['access'] = [
		        'class' => AccessControl::className(),
		        'only' => ['index', 'view', 'create', 'update', 'delete', 'getPermissions'], //only be applied to
		        'rules' => [
			        [
				        'allow' => true,
				        'actions' => ['index', 'view', 'create', 'update', 'delete', 'getPermissions'],
				        'roles' => ['admin', 'manageStaffs'],
			        ],
		        ],
	        ];

            return $behaviors;
        }

	    /**
	     * Return list of staff members
	     *
	     * @return ActiveDataProvider
	     */
        public function actionIndex(){
            return new ActiveDataProvider([
                'query' =>  User::find()->where([
	                '!=', 'status', -1
                ])->andWhere([
	                'in', 'role', [User::ROLE_STAFF, User::ROLE_ADMIN]
                ])
            ]);
        }

	    /**
	     * Return requested staff member information
	     *
	     * Request: /v1/staff/2
	     *
	     * Sample Response:
	     * {
		 *   "success": true,
		 *   "status": 200,
		 *   "data": {
		 *	        "id": 2,
		 *		    "username": "staff",
		 *		    "email": "staff@staff.com",
		 *		    "unconfirmed_email": "lygagohur@hotmail.com",
		 *		    "role": 50,
		 *		    "role_label": "Staff",
		 *		    "last_login_at": "2017-05-20 18:58:40",
		 *		    "last_login_ip": "127.0.0.1",
		 *		    "confirmed_at": "2017-05-15 09:20:53",
		 *		    "blocked_at": null,
		 *		    "status": 10,
		 *		    "status_label": "Active",
		 *		    "created_at": "2017-05-15 09:19:02",
		 *		    "updated_at": "2017-05-21 23:31:32"
		 *	    }
		 *   }
	     *
	     * @param $id
	     *
	     * @return array|null|\yii\db\ActiveRecord
	     * @throws NotFoundHttpException
	     */
        public function actionView($id){
            $staff = User::find()->where([
	            'id'    =>  $id
            ])->andWhere([
	            '!=', 'status', -1
            ])->andWhere([
	            'in', 'role', [User::ROLE_STAFF, User::ROLE_ADMIN]
            ])->one();
            if($staff){
                return $staff;
            } else {
                throw new NotFoundHttpException("Object not found: $id");
            }
        }

	    /**
	     * Create new staff member from backend dashboard
	     *
	     * Request: POST /v1/staff/1
	     *
	     * @return User
	     * @throws HttpException
	     */
        public function actionCreate(){
            $model = new User();
            $model->load(\Yii::$app->getRequest()->getBodyParams(), '');

            if ($model->validate() && $model->save()) {
                $response = \Yii::$app->getResponse();
                $response->setStatusCode(201);
                $id = implode(',', array_values($model->getPrimaryKey(true)));
                $response->getHeaders()->set('Location', Url::toRoute([$id], true));
            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }

            return $model;
        }

	    /**
	     * Update staff member information from backend dashboard
	     *
	     * Request: PUT /v1/staff/1
	     *  {
		 *  	"id": 20,
		 *  	"username": "testuser",
		 *  	"email": "test2@test.com",
		 *  	"unconfirmed_email": "test2@test.com",
	     *  	"password": "{password}",
		 *  	"role": 50,
		 *  	"role_label": "Staff",
		 *  	"last_login_at": null,
		 *  	"last_login_ip": null,
		 *  	"confirmed_at": null,
		 *  	"blocked_at": null,
		 *  	"status": 10,
		 *  	"status_label": "Active",
		 *  	"created_at": "2017-05-27 17:30:12",
		 *  	"updated_at": "2017-05-27 17:30:12",
		 *  	"permissions": [
		 *  		{
		 *  			"name": "manageSettings",
		 *  			"description": "Manage settings",
		 *  			"checked": false
		 *  		},
		 *  		{
		 *  			"name": "manageStaffs",
		 *  			"description": "Manage staffs",
		 *  			"checked": false
		 *  		},
		 *  		{
		 *  			"name": "manageUsers",
		 *  			"description": "Manage users",
		 *  			"checked": true
		 *  		}
		 *  	]
		 *  }
	     *
	     *
	     * @param $id
	     *
	     * @return array|null|\yii\db\ActiveRecord
	     * @throws HttpException
	     */
        public function actionUpdate($id) {
            $model = $this->actionView($id);

            $model->load(\Yii::$app->getRequest()->getBodyParams(), '');

            if ($model->validate() && $model->save()) {
                $response = \Yii::$app->getResponse();
                $response->setStatusCode(200);
            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }

            return $model;
        }

	    /**
	     * Delete requested staff member from backend dashboard
	     *
	     * Request: DELETE /v1/staff/1
	     *
	     * @param $id
	     *
	     * @return string
	     * @throws ServerErrorHttpException
	     */
        public function actionDelete($id) {
            $model = $this->actionView($id);

            $model->status = User::STATUS_DELETED;

            if ($model->save(false) === false) {
                throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
            }

            $response = \Yii::$app->getResponse();
            $response->setStatusCode(204);
            return "ok";
        }

	    /**
	     * Handle the login process for staff members for backend dashboard
	     *
	     * Request: POST /v1/staff/login
	     *
	     *
	     * @return array
	     * @throws HttpException
	     */
        public function actionLogin(){
            $model = new LoginForm();

	        $model->roles = [
	            User::ROLE_ADMIN,
	            User::ROLE_STAFF
	        ];
            if ($model->load(Yii::$app->request->post()) && $model->login()) {
                $user = $model->getUser();
                $user->generateAccessTokenAfterUpdatingClientInfo(true);

                $response = \Yii::$app->getResponse();
                $response->setStatusCode(200);
                $id = implode(',', array_values($user->getPrimaryKey(true)));

                $responseData = [
                    'id'    =>  $id,
                    'access_token' => $user->access_token,
                ];

                return $responseData;
            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }
        }


	    /**
	     * Return list of available permissions for the staff.  The function will be called when staff form is loaded in backend.
	     *
	     * Request: GET /v1/staff/get-permissions
	     *
	     * Sample Response:
	     * {
		 *		"success": true,
		 *		"status": 200,
		 *		"data": {
		 *			"manageSettings": {
		 *				"name": "manageSettings",
		 *				"description": "Manage settings",
		 *				"checked": false
		 *			},
		 *			"manageStaffs": {
		 *				"name": "manageStaffs",
		 *				"description": "Manage staffs",
	     *				"checked": false
		 *			}
		 *		}
		 *	}
	     */
	    public function actionGetPermissions(){
		    $authManager = Yii::$app->authManager;

		    /** @var Permission[] $permissions */
		    $permissions = $authManager->getPermissions();

		    /** @var array $tmpPermissions to store list of available permissions */
		    $tmpPermissions = [];

		    /**
		     * @var string $permissionKey
		     * @var Permission $permission
		     */
		    foreach($permissions as $permissionKey => $permission) {
			    $tmpPermissions[] = [
		            'name'          =>  $permission->name,
		            'description'   =>  $permission->description,
		            'checked'       =>  false,
		        ];
		    }

		    return $tmpPermissions;
	    }

        public function actionOptions($id = null) {
            return "ok";
        }


    }