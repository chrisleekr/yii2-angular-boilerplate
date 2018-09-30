<?php

namespace app\modules\v1\controllers;

use app\filters\auth\HttpBearerAuth;
use app\models\Setting;
use yii\data\ActiveDataProvider;
use yii\filters\AccessControl;
use yii\filters\auth\CompositeAuth;
use yii\helpers\Url;
use yii\rest\ActiveController;
use yii\web\HttpException;
use yii\web\NotFoundHttpException;
use yii\web\ServerErrorHttpException;

class SettingController extends ActiveController
{
    public $modelClass = 'app\models\Setting';

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
                'index' => ['get'],
                'view' => ['get'],
                'create' => ['post'],
                'update' => ['put'],
                'delete' => ['delete'],
                'public' => ['get'],
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
        $behaviors['authenticator']['except'] = ['options', 'public'];

        // setup access
        $behaviors['access'] = [
            'class' => AccessControl::className(),
            'only' => ['index', 'view', 'create', 'update', 'delete'], //only be applied to
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['index', 'view', 'create', 'update', 'delete'],
                    'roles' => ['admin', 'manageSettings'],
                ],
            ],
        ];

        return $behaviors;
    }

    public function actionIndex()
    {
        return new ActiveDataProvider(
            [
                'query' => Setting::find()->where(
                    [
                        'status' => 1,
                    ]
                )
            ]
        );
    }

    /**
     * Create new setting
     *
     * @return Setting
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionCreate()
    {
        $model = new Setting();

        $bodyParam = \Yii::$app->getRequest()->getBodyParams();
        if (isset($bodyParam['meta_key'])) {
            $bodyParam['meta_key'] = strtolower($bodyParam['meta_key']);
        }
        $model->load($bodyParam, '');
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
     * Update setting
     *
     * @param $id
     * @return array|null|\yii\db\ActiveRecord
     * @throws HttpException
     * @throws NotFoundHttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate($id)
    {
        $model = $this->actionView($id);

        $bodyParams = \Yii::$app->getRequest()->getBodyParams();
        if (isset($bodyParams['meta_key'])) {
            $bodyParams['meta_key'] = strtolower($bodyParams['meta_key']);
        }
        $model->load($bodyParams, '');

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
     * View setting
     *
     * @param $id
     * @return array|null|\yii\db\ActiveRecord
     * @throws NotFoundHttpException
     */
    public function actionView($id)
    {
        $setting = Setting::find()->where(
            [
                'id' => $id,
                'status' => 1,
            ]
        )->one();
        if ($setting) {
            return $setting;
        } else {
            throw new NotFoundHttpException("Object not found: $id");
        }
    }

    /**
     * Delete setting
     *
     * @param $id
     * @return string
     * @throws NotFoundHttpException
     * @throws ServerErrorHttpException
     * @throws \Throwable
     * @throws \yii\db\StaleObjectException
     */
    public function actionDelete($id)
    {
        $model = $this->actionView($id);

        if ($model->delete() === false) {
            throw new ServerErrorHttpException('Failed to delete the object for unknown reason.');
        }

        $response = \Yii::$app->getResponse();
        $response->setStatusCode(204);
        return 'ok';
    }

    /**
     * Return public settings
     *
     * @return array
     */
    public function actionPublic()
    {
        $publicSettings = [];

        $settings = Setting::find()->where(
            [
                'is_public' => 1,
                'status' => 1,
            ]
        )->all();

        if ($settings) {
            foreach ($settings as $settingKey => $setting) {
                $publicSettings[] = [
                    'meta_key' => $setting['meta_key'],
                    'meta_type' => $setting['meta_type'],
                    'meta_value' => $setting['meta_value']
                ];
            }
        }

        return $publicSettings;
    }

    /**
     * Handle OPTIONS
     *
     * @param null $id
     * @return string
     */
    public function actionOptions($id = null)
    {
        return 'ok';
    }
}
