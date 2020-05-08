<?php

namespace app\modules\v1;

class Module extends \yii\base\Module
{
    public $controllerNamespace = 'app\modules\v1\controllers';

    public function init()
    {
        parent::init();

        // custom initialization code goes here
        // As yii uses session by default, will need to disable session as it will violate the stateless constraints
        // of a RESTful server
        \Yii::$app->user->enableSession = false;
    }
}
