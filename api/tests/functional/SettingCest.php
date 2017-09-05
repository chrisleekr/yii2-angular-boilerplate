<?php
	class SettingCest
	{
		public function _before(\FunctionalTester $I)
		{
		}

		public function testSettingPublic(\FunctionalTester $I)
		{
			$I->sendGET('/v1/setting/public', []);
			$I->canSeeResponseCodeIs(200);
			$I->seeResponseIsJson();
			$I->seeResponseContainsJson([
				'success'   =>  true,
				'data'      =>  [
					[
						'meta_key'  =>  'timezone',
						'meta_type' =>  'select',
						'meta_value'    =>  'Australia/Melbourne'
					]
				]
			]);
		}
	}