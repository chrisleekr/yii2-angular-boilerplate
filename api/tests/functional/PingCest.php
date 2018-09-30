<?php

namespace tests\functional;

class PingCest
{
    public function _before(\FunctionalTester $I)
    {
    }

    public function testPing(\FunctionalTester $I)
    {
        $I->sendGET('/ping', []);
        $I->seeResponseContains('pong');
    }
}
