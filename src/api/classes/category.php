<?php
class Category {

    /**
     * Constants
     */
     public static $TYPE_SIMPLE = 1;
     public static $TYPE_COMPLEX = 2;
     public static $categories = array();

     /**
      * Public variables
      */
     public $name = '';
     public $nicename = '';
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
     * @param {SimpleXMLObject} $object The object that we need to parse
     * @author Thodoris Tsiridis
     */
    public function __construct($object, $type = 1) {

        if($type === Category::$TYPE_SIMPLE){

            $this->name = (string)$object;
            $this->nicename = (string)$object['nicename'];

        } else if($type === Category::$TYPE_COMPLEX) {

            $this->name = $object->xpath('wp:cat_name');
            $this->name = (string)$this->name[0];

            $this->nicename = $object->xpath('wp:category_nicename');
            $this->nicename = (string)$this->nicename[0];

            $this->id = $object->xpath('wp:term_id');
            $this->id = (string)$this->id[0];

        }

    }

}
?>