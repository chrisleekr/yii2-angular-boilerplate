<?php
    namespace app\modules\v1\controllers;

    use app\filters\auth\HttpBearerAuth;
    use Yii;

    use yii\data\ActiveDataProvider;
    use yii\filters\auth\CompositeAuth;
    use yii\helpers\Url;
    use yii\rest\ActiveController;

    use yii\web\HttpException;
    use yii\web\NotFoundHttpException;
    use yii\web\ServerErrorHttpException;

    use app\models\PasswordResetForm;
    use app\models\User;
    use app\models\SignupForm;
    use app\models\LoginForm;
    use app\models\SignupConfirmForm;
    use app\models\PasswordResetRequestForm;
    use app\models\PasswordResetTokenVerificationForm;

    class UserController extends ActiveController
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
                    'login'  => ['post']
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
            $behaviors['authenticator']['except'] = ['options', 'login', 'signup', 'confirm', 'password-reset-request', 'password-reset-token-verification', 'password-reset'];
            return $behaviors;
        }

        public function actionIndex(){
            return new ActiveDataProvider([
                'query' =>  User::find()
            ]);
        }

        public function actionView($id){
            $staff = User::find()->where([
                'id'    =>  $id
            ])->one();
            if($staff){
                return $staff;
            } else {
                throw new NotFoundHttpException("Object not found: $id");
            }
        }

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

        public function actionLogin(){
            $model = new LoginForm();

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

        public function actionSignup(){
            $model = new SignupForm();

            $model->load(Yii::$app->request->post());

            if ($model->validate() && $model->signup()) {
                // Send confirmation email
                $model->sendConfirmationEmail();

                $response = \Yii::$app->getResponse();
                $response->setStatusCode(201);

                $responseData = "true";

                return $responseData;
            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }
        }

        public function actionConfirm(){
            $model = new SignupConfirmForm();

            $model->load(Yii::$app->request->post());
            if ($model->validate() && $model->confirm()) {

                $response = \Yii::$app->getResponse();
                $response->setStatusCode(200);

                $user = $model->getUser();
                $responseData = [
                    'id'    =>  $user->id,
                    'access_token' => $user->access_token,
                ];

                return $responseData;

            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }
        }

        public function actionPasswordResetRequest(){
            $model = new PasswordResetRequestForm();

            $model->load(Yii::$app->request->post());
            if ($model->validate() && $model->sendPasswordResetEmail()) {

                $response = \Yii::$app->getResponse();
                $response->setStatusCode(200);

                $responseData = "true";

                return $responseData;
            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }
        }

        public function actionPasswordResetTokenVerification(){
            $model = new PasswordResetTokenVerificationForm();

            $model->load(Yii::$app->request->post());
            if ($model->validate() && $model->validate()) {

                $response = \Yii::$app->getResponse();
                $response->setStatusCode(200);

                $responseData = "true";

                return $responseData;
            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }
        }

        /**
         * Resets password.
         */
        public function actionPasswordReset() {
            $model = new PasswordResetForm();
            $model->load(Yii::$app->request->post());

            if ($model->validate() && $model->resetPassword()) {

                $response = \Yii::$app->getResponse();
                $response->setStatusCode(200);

                $responseData = "true";

                return $responseData;
            } else {
                // Validation error
                throw new HttpException(422, json_encode($model->errors));
            }
        }

        public function actionOptions($id = null) {
            return "ok";
        }
    }