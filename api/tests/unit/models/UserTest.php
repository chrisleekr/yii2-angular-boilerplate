<?php
namespace tests\models;


use Codeception\Specify;
use app\models\User;
use Yii;

class UserTest extends \Codeception\Test\Unit
{

	use Specify;

	public function testValidate() {
		// Validation requires method to be set
		//      The function validateUsername requires Yii::$app->request to determine mode - create or update.
		//      When request method is POST, then mode is creation.
		//      When request mode is PUT, the mode is update.
		$_POST['_method'] = 'post';

		$this->specify('username and email are required',
			function(){
				// Initialise User model
				$user = new User();

				// Verify validation fails as didn't provide any attributes
				$this->assertFalse($user->validate());

				// Verify that the username and password properties are required
				$this->assertTrue($user->hasErrors('username'));
				$this->assertTrue($user->hasErrors('email'));

				// Set temporary values for username and email
				$user->username = 'test';
				$user->email = 'test@example.com';

				// Verify validation succeed
				$this->assertTrue($user->validate());
			});

		$this->specify('username length must be between 3 and 15 characters', function(){
			// Initialise User model
			$user = new User();

			// Set username length as 2
			$user->username = 'ab';
			// Verify that validation must be failed
			$this->assertFalse($user->validate());
			// Verify that username validation contains error message
			$this->assertTrue($user->hasErrors('username'));

			// Set username length as 3
			$user->username = 'abc';
			// Verify that validation must be failed
			$this->assertFalse($user->validate());
			// Verify that username validation does not contain error message
			$this->assertFalse($user->hasErrors('username'));

			// Set username length as 16
			$user->username = 'abcdefghijklmnop';
			// Verify that validation must be failed
			$this->assertFalse($user->validate());
			// Verify that username validation contains error message
			$this->assertTrue($user->hasErrors('username'));
		});

		$this->specify('username must be alphanumeric, underscores and dashes', function(){
		});

		$this->specify('username is unique', function(){
		});



		$this->specify('email length must be less than 255 characters', function(){
		});

		$this->specify('email must be valid', function(){
		});

		$this->specify('email is unique', function(){
		});

		$this->specify('password is required on POST method', function(){
		});

		$this->specify('password must be longer than 6', function(){
		});

		$this->specify('status must be Active or Disabled', function(){
		});

		$this->specify('role must be User, Staff or Admin', function(){
		});


		$this->specify('permission must be valid', function(){
		});
	}

//    public function testFindUserById()
//    {
//        expect_that($user = User::findIdentity(100));
//        expect($user->username)->equals('admin');
//
//        expect_not(User::findIdentity(999));
//    }
//
//    public function testFindUserByAccessToken()
//    {
//        expect_that($user = User::findIdentityByAccessToken('100-token'));
//        expect($user->username)->equals('admin');
//
//        expect_not(User::findIdentityByAccessToken('non-existing'));
//    }
//
//    public function testFindUserByUsername()
//    {
//        expect_that($user = User::findByUsername('admin'));
//        expect_not(User::findByUsername('not-admin'));
//    }
//
//    /**
//     * @depends testFindUserByUsername
//     */
//    public function testValidateUser($user)
//    {
//        $user = User::findByUsername('admin');
//        expect_that($user->validateAuthKey('test100key'));
//        expect_not($user->validateAuthKey('test102key'));
//
//        expect_that($user->validatePassword('admin'));
//        expect_not($user->validatePassword('123456'));
//    }



}
