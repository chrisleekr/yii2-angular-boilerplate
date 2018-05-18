<?php
	class UserCest
	{
		public function _before(\FunctionalTester $I)
		{
		}

		public function testUserLogin(\FunctionalTester $I)
		{
			$I->haveHttpHeader('Content-Type', 'application/json');

			$I->sendPOST('/v1/user/login', '{"LoginForm":{"username": "user","password": "123456"}}');
			$I->canSeeResponseCodeIs(200);
			$I->seeResponseIsJson();


			$I->seeResponseContainsJson([
				'success'   =>  true,
				'status'    =>  200,
			]);

			$I->seeResponseMatchesJsonType([
				'id' => 'integer',
				'access_token' => 'string',
			], '$.data');
		}
	}