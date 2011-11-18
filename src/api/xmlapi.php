<?php
class API {

    /**
     * Constants
     */
     protected static $XML = '';


     protected $posts = array();


    /**
     * Returns an array with all the categories
     * @return {Array}
     */
    public function getCategories() {

        //TODO: First check memcache
        return Category::$categories;
    }

    /**
     * Returns an array with all the posts
     *
     * @param {Number} $categoryId The id of the parent category
     * @param {Number} $start The beginning of the result set
     * @param {Number} $total The total items to laod
     *
     * @return {Array}
     */
    public function getPosts($categoryId = null, $start = 0, $total = 10) {

        //TODO: First check memcache

        if($categoryId !== null ){

            $temp = array();
            $total = count($this->posts);

            for ($i=0; $i < $total; $i++) {

                $post = $this->posts[$i];

                if($post->belongsToCategory($categoryId)){
                    $temp[] = $post;
                }

            }

        } else {
            $temp = $this->posts;
        }

        return array_slice($temp, $start, $total);

    }

    public function getPostDetails($postId) {
        //TODO: First check memcache
    }

    public function getComments($postId) {
        //TODO: First check memcache
    }

    public function parseXML($xml) {

        $modifiedDate = 0;
        $total = 0;
        $items = array();

        // Save the XML path
        self::$XML = $xml;

        // Load the xml
        $xmlData = simplexml_load_file(self::$XML);

        // Get the modified date of the file
        $modifiedDate = filemtime(self::$XML);

        // TODO: Add logic to check in memcache if the modification date is different for the file
        if(!$modifiedDate){
            return false;
        }

        $categories = $xmlData->xpath('//channel/wp:category');
        $total = count($categories);

        // Get all the categories
        for ($i=0; $i < $total; $i++) {
            $category = new Category($categories[$i], Category::$TYPE_COMPLEX);
            Category::$categories[$category->nicename] = $category;
        }

        //print_r($this->getCategories());
        // Get all the posts
        $items = $xmlData->xpath('//channel/item');
        $total = count($items);

        // Get all the categories
        for ($i=0; $i < $total; $i++) {
            $this->posts[] = new Post($items[$i]);
        }

        unset($modifiedDate);
        unset($total);
        unset($categories);
        unset($items);
        unset($xmlData);

    }
}
?>