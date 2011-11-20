<?php
class API {

    /**
     * Constants
     */
     protected static $XML = '';

     /**
      * Protected variables
      */
     protected $posts = array();
     protected $pages = array();

    /**
     * Returns an array with all the categories
     * @return {Array}
     * @author Thodoris Tsiridis
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
     * @author Thodoris Tsiridis
     */
    public function getPosts($categoryId = null, $start = 0, $total = 10, $sort = 'date DESC') {

        //TODO: First check memcache

        if($categoryId !== null ){

            $temp = array();
            $len = count($this->posts);

            for ($i=0; $i < $len; $i++) {

                $post = $this->posts[$i];

                if($post->belongsToCategory($categoryId)){
                    $temp[] = $post;
                }

            }

        } else {
            $temp = $this->posts;
        }

        // First sort
        if($sort === Post::$SORT_DATE_ASC){
            usort($temp, array($this, "custom_sort_post_date_asc"));
        }

        if($sort === Post::$SORT_DATE_DESC){
            usort($temp, array($this, "custom_sort_post_date_desc"));
        }

        return $temp;
        return array_slice($temp, $start, $total);

    }

    /**
     * Returns an array with all the pages
     *
     * @param {Number} $categoryId The id of the parent category
     * @param {Number} $start The beginning of the result set
     * @param {Number} $total The total items to laod
     *
     * @return {Array}
     * @author Thodoris Tsiridis
     */
    public function getPages($categoryId = null, $start = 0, $total = 10, $sort = 'date DESC') {

        //TODO: First check memcache

        if($categoryId !== null ){

            $temp = array();
            $len = count($this->pages);

            for ($i=0; $i < $len; $i++) {

                $post = $this->pages[$i];

                if($post->belongsToCategory($categoryId)){
                    $temp[] = $post;
                }

            }

        } else {
            $temp = $this->posts;
        }

        // First sort
        if($sort === Post::$SORT_DATE_ASC){
            usort($temp, array($this, "custom_sort_post_date_asc"));
        }

        if($sort === Post::$SORT_DATE_DESC){
            usort($temp, array($this, "custom_sort_post_date_desc"));
        }

        return $temp;
        return array_slice($temp, $start, $total);

    }

    /**
     * Gets the details of a post
     *
     * @param {Number} $postId The id of the post that we want to get the details
     * @return {Object}
     * @author Thodoris Tsiridis
     */
    public function getPostDetails($postId) {
        //TODO: First check memcache
    }

    /**
     * Gets the details of a post
     *
     * @param {Number} $postId The id of the post that we want to get the details
     * @return {Object}
     * @author Thodoris Tsiridis
     */
    public function getComments($postId) {
        //TODO: First check memcache
    }

    /**
     * Gets the details of a post
     *
     * @param {String} $xml The path to the xml
     * @author Thodoris Tsiridis
     */
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
            // Check that it is not an attachment
            $type = $items[$i]->xpath('wp:post_type');
            $type = (string)$type[0];

            if($type == 'post') {
                $this->posts[] = new Post($items[$i]);
            } else if($type == 'page') {
                $this->pages[] = new Post($items[$i]);
            }

            unset($type);
        }

        unset($modifiedDate);
        unset($total);
        unset($categories);
        unset($items);
        unset($xmlData);

    }

    /**
     * Checks to Post objects so that they can be sorted
     *
     * @param {Post} $a The first object to check
     * @param {Post} $b The second object to check
     * @author Thodoris Tsiridis
     */
    protected function custom_sort_post_date_asc($a, $b) {
        return $a->pubDate > $b->pubDate;
    }

    /**
     * Checks to Post objects so that they can be sorted
     *
     * @param {Post} $a The first object to check
     * @param {Post} $b The second object to check
     * @author Thodoris Tsiridis
     */
    protected function custom_sort_post_date_desc($a, $b) {
        return $a->pubDate < $b->pubDate;
    }

}
?>