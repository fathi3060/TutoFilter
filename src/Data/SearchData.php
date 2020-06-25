<?php

namespace App\Data;

use App\Entity\Category;

class SearchData
{
    /**
     * @var integer
     */
    public $page = 1;

    /**
     * @var string
     */
    public $q = '';

    /**
     * @var Category[]
     */
    public $categories = [];

    /**
     * @var Null|Integer
     */
    public $max;

    /**
     * @var Null|Integer
     */
    public $min;

    /**
     *  @var Boolean
     */
    public $promo = false;
}