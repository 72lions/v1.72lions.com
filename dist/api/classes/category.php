<?php
class Category {

    /**
     * Constants
     */
     public static $categories = array();
     public static $SORT_NAME_ASC = 'name ASC';
     public static $SORT_NAME_DESC = 'name DESC';

     /**
      * Public variables
      */
     public $name = '';
     public $slug = '';
     public $id = 0;

    /**
     * Adds a category object to the categories array
     *
     * @param {Category} $category The category we want to add to the categories array
     * @author Thodoris Tsiridis
     */
    public static function addCategory($category) {
        self::$categories[] = $category;
    }

    /**
     * Constructor
     * @param {Array} $object The object that we need to parse
     * @author Thodoris Tsiridis
     */
    public function __construct($object) {

        $this->name = $object['name'];
        $this->slug = $object['slug'];
        $this->id = $object['term_id'];

    }

}
?>
