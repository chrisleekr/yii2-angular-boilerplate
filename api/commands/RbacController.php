<?php
	/**
	 * RBAC Controller
	 *
	 * Assigning a role to specific user
	 *
	 * $ ./yii rbac/assign {role} {username}
	 * $ ./yii rbac/assign admin chris
	 * $ ./yii rbac/assign staff alex
	 */
	namespace app\commands;

	use app\models\User;
	use yii\base\InvalidParamException;
	use yii\console\Controller;

	class RbacController extends Controller
	{
		public function actionAssign($role, $username)
		{
			$user = User::find()->where(['username' => $username])->one();
			if (!$user) {
				throw new InvalidParamException("There is no user \"$username\".");
			}

			$auth = \Yii::$app->authManager;
			$roleObject = $auth->getRole($role);
			if (!$roleObject) {
				throw new InvalidParamException("There is no role \"$role\".");
			}

			$auth->assign($roleObject, $user->id);
		}
	}