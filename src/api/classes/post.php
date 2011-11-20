<?php
class Post {

    /**
     * Constants
     */
     public static $SORT_DATE_ASC = 'post_date ASC';
     public static $SORT_DATE_DESC = 'post_date DESC';

    /**
     * Public variables
     */
    public $title = '';
    public $link = '';
    public $pubDate = '';
    public $description = '';
    public $content = '';
    public $creator = '';
    public $categories = array();
    public $id = 0;

    /**
     * Constructor
     * @param {Array} $object The object that we need to parse
     * @author Thodoris Tsiridis
     */
    public function __construct($object) {
        $this->title = $object['post_title'];
        $this->link = $object['guid'];
        $this->pubDate = $object['post_date'];
        $this->creator = $object['post_author'];
        $this->description = $object['post_excerpt'];
        $this->content = $object['post_content'];
        $this->id = $object['ID'];

    }

    /**
     * Adds it to a specific category
     * @param {Category} $category The category that it belongs to
     * @author Thodoris Tsiridis
     */
    public function addToCategory($category) {
        $this->categories[] = $category;
    }

    /**
     * Checks if a post belongs to a category
     * @param {Number} $id The id of the category
     * @author Thodoris Tsiridis
     */
    public function belongsToCategory($id){

        $total = count($this->categories);

        for ($i=0; $i < $total; $i++) {
            if ((int)$this->categories[$i]->id === (int)$id) {
                return true;
            }
        }

        return false;
    }

}
?>
