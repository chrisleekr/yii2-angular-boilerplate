<?php

namespace app\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;

class UserSearch extends Model
{
    public $q;
    public $page = 1;
    public $per_page = 20;
    public $in_roles = [];
    public $not_in_status = [];

    public function rules()
    {
        return [
            [['page', 'per_page'], 'integer'],
            [['q'], 'string', 'max' => 50],
        ];
    }

    public function formName()
    {
        return '';
    }

    public function getDataProvider()
    {
        $queryParams = [];
        $query = User::find()
            ->where(['not in', 'user.status', $this->not_in_status])
            ->andWhere(['in', 'role', $this->in_roles]);

        if ($this->q) {
            $query->andWhere([
                'or',
                ['like', 'user.username', $this->q],
                ['like', 'user.email', $this->q],
                ['like', 'user.registration_ip', $this->q],
                ['like', 'user.last_login_ip', $this->q],
            ]);
            $queryParams['q'] = $this->q;
        }

        $page = $this->page > 0 ? ($this->page - 1) : 0;
        $pageSize = (int)$this->per_page;

        $provider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'forcePageParam' => true,
                'page' => $page,
                'pageParam' => 'page',
                'defaultPageSize' => $pageSize,
                'pageSizeLimit' => [1, 100],
                'pageSizeParam' => 'per_page',
                'validatePage' => true,
                'params' => $queryParams,
            ],
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_DESC,
                ]
            ]
        ]);

        $rows = $provider->getModels();
        $pagination = array_intersect_key(
            (array)$provider->pagination,
            array_flip(
                \Yii::$app->params['paginationParams']
            )
        );

        $pagination['firstRowNo'] = $pagination['totalCount'] - ($page * $pageSize);

        return [
            'rows' => $rows,
            'pagination' => $pagination,
        ];
    }
}
