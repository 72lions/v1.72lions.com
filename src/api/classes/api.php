<?php
class API {

    /**
     * Constants
     */
     protected static $XML = '';
     protected static $DB_USERNAME = 'root';
     protected static $DB_PASSWORD = '';
     protected static $DB_HOST = 'localhost';
     protected static $DB_NAME = '72lionswp';

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
    public function getPosts($categoryId = null, $start = 0, $total = 10, $sort = 'post_date DESC') {



        if($categoryId !== null){

            $query = "SELECT * FROM wp_posts
            WHERE post_status='publish'
            AND post_type='post'
            ORDER BY ".$sort."
            LIMIT ".$start.",".$total;

        } else {

            $query = "SELECT * FROM wp_posts
            WHERE post_status='publish'
            AND post_type='post'
            ORDER BY ".$sort."
            LIMIT ".$start.",".$total;

        }

        if(MC::get($query) === null){

            echo 'reading from db';

            $db = new DB();
            $db->connect(self::$DB_USERNAME, self::$DB_PASSWORD, self::$DB_HOST, self::$DB_NAME);
            $result = mysql_query($query) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){

                $post = new Post($row);
                $this->posts[] = $post;

            }

            $db->disconnect();
            unset($db);

            MC::set($query, $this->posts);
            print_r(MC::get($query));
        }

        return MC::get($query);


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
    public function getPages($categoryId = null, $start = 0, $total = 10, $sort = 'post_date DESC') {

        if($categoryId !== null){
            $query = "SELECT * FROM wp_posts WHERE ";
        } else {
            $query = "SELECT * FROM wp_posts ORDER BY ".mysql_real_escape_string($sort)." LIMIT ".$start.",".$total;
        }

        echo $query;
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
