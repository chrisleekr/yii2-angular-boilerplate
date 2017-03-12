<?php

    namespace app\controllers;

    use Yii;
    use yii\base\Object;
    use yii\web\Controller;
    use yii\web\Response;

    class SiteController extends Controller
    {

        public function actionPing()
        {
            $response = new Response();
            $response->statusCode = 200;
            $response->data = Yii::t('app','pong');

            return $response;
        }


        public function actionError() {

            $response = new Response();
            $response->statusCode = 400;
            $response->data = json_encode([
                "name"      => "Bad Request",
                "message"   => Yii::t('app', 'The system could not process your request. Please check and try again.'),
                "code"      => 0,
                "status"    => 400,
                "type"      => "yii\\web\\BadRequestHttpException"
            ]);

            return $response;
        }


    }
