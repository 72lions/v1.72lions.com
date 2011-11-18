<?php
class Post {

    /**
     * Public variables
     */
     public $title = '';
     public $link = '';
     public $pubDate = '';
     public $description = '';
     public $content = '';
     public $creator = '';
     public $postname = '';
     public $categories = array();
     public $id = 0;

    /**
     * Constructor
     * @param {SimpleXMLObject} $object The object that we need to parse
     */
    public function __construct($object) {

        $this->title = $object->xpath('title');
        $this->link = $object->xpath('link');
        $this->pubDate = $object->xpath('pubDate');
        $this->creator = $object->xpath('dc:creator');
        $this->description = $object->xpath('description');
        $this->content = $object->xpath('content:encoded');
        $this->postname = $object->xpath('wp:post_name');
        $this->id = $object->xpath('wp:post_id');


        $this->title = (string)$this->title[0];
        $this->link = (string)$this->link[0];
        $this->pubDate = (string)$this->pubDate[0];
        $this->creator = (string)$this->creator[0];
        $this->description = (string)$this->description[0];
        $this->content = (string)$this->content[0];
        $this->postname = (string)$this->postname[0];
        $this->id = (string)$this->id[0];

        // Parse the categories
        $categoriesTemp = $object->xpath('category');
        $totalCategories = count($categoriesTemp);

        for ($i=0; $i < $totalCategories; $i++) {

            $cat = new Category($categoriesTemp[$i]);

            if(Category::$categories[$cat->nicename] !== undefined && Category::$categories[$cat->nicename] !== null ){
                $cat = Category::$categories[$cat->nicename];
            }

            $this->categories[] = $cat;

        }

        unset($categoriesTemp);
        unset($totalCategories);
    }

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