<?php
	namespace app\modules\v1\controllers;

	use Sse\Events\TimedEvent;
	use Yii;

	use yii\filters\AccessControl;
	use yii\filters\auth\CompositeAuth;
	use app\filters\auth\HttpBearerAuth;
	use yii\rest\Controller;
	use odannyc\Yii2SSE\SSEBase;


	class PageController extends Controller
	{
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
					'sse'  => ['get'],
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
					'Access-Control-Request-Method' => ['GET'],
					'Access-Control-Request-Headers' => ['*'],
				],
			];

			// re-add authentication filter
			$behaviors['authenticator'] = $auth;
			// avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
			$behaviors['authenticator']['except'] = ['options', 'sse'];

			// setup access
			$behaviors['access'] = [
				'class' => AccessControl::className(),
				'only' => ['sse'], //only be applied to
				'rules' => [
					[
						'allow' => true,
						'actions' => ['sse'],
						'roles' => ['?'],
					],
				],
			];

			$behaviors['contentNegotiator'] = [
				'class' => \yii\filters\ContentNegotiator::className(),
				'only' => ['sse'],
				'formatParam' => '_format',
				'formats' => [
					'text/event-stream' => \yii\web\Response::FORMAT_RAW,
				],
			];

			return $behaviors;
		}

		public function actionSse(){
			$sse = Yii::$app->sse;
			$sse->set('sleep_time', 0.1);
			$sse->set('allow_cors', true);
			$sse->addEventListener('message', new MessageEventHandler());

			$sse->start();
			$sse->flush();
		}




		public function actionOptions($id = null) {
			return "ok";
		}
	}

	class MessageEventHandler extends TimedEvent
	{
		public $period = 5; // the interval in seconds

		private $stocks = [
			[
				'symbol'    =>  'MSFT',
				'price'     =>  30.00,
				'change'    =>  0
			],
			[
				'symbol'    =>  'APPL',
				'price'     =>  30.00,
				'change'    =>  0
			],
			[
				'symbol'    =>  'GOOG',
				'price'     =>  30.00,
				'change'    =>  0
			]
		];
		public function check()
		{
			return true;
		}

		public function update()
		{
			foreach($this->stocks as $stockKey => $stock) {
				$currentPrice = $stock['price'];
				$changedPercentage = rand(-5, 5);
				$newPrice = $currentPrice + ($currentPrice*($changedPercentage /100));

				$this->stocks[$stockKey]['price'] = $newPrice;
				$this->stocks[$stockKey]['change'] = $newPrice - $currentPrice;

			}
			return json_encode($this->stocks);
		}
	}