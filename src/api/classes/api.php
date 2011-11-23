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

        $query = "SELECT WT.* FROM wp_terms WT, wp_term_taxonomy WTT
                WHERE WT.term_id =  WTT.term_id
                AND taxonomy='category'";

        if(MC::get($query) == null){

            $db = new DB();
            $db->connect(self::$DB_USERNAME, self::$DB_PASSWORD, self::$DB_HOST, self::$DB_NAME);
            $result = mysql_query($query) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){

                $category = new Category($row);
                Category::addCategory($category);
                MC::set('category'.$category->id, $category);

            }

            $db->disconnect();
            unset($db);

            MC::set($query, Category::$categories);
        }

        return MC::get($query);
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

        $db = new DB();
        $db->connect(self::$DB_USERNAME, self::$DB_PASSWORD, self::$DB_HOST, self::$DB_NAME);
        if($categoryId !== null){

            $query = "SELECT * FROM wp_posts WPP,
            wp_term_taxonomy WPTT,
            wp_term_relationships WPTR
            WHERE WPP.post_status='publish'
            AND WPP.post_type='post'
            AND WPTT.term_id=".mysql_real_escape_string($categoryId)."
            AND WPTT.taxonomy='category'
            AND WPTR.term_taxonomy_id = WPTT.term_taxonomy_id
            AND WPTR.object_id = WPP.ID
            ORDER BY ".$sort."
            LIMIT ".$start.",".$total;

        } else {

            $query = "SELECT * FROM wp_posts
            WHERE post_status='publish'
            AND post_type='post'
            ORDER BY ".$sort."
            LIMIT ".$start.",".$total;

        }



        if(MC::get($query) == null){

            $result = mysql_query($query) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){

                $post = new Post($row);
                $this->posts[] = $post;
                MC::set('post'.$post->id, $post);

            }

            MC::set($query, $this->posts);
        }

        $data = $this->posts;//MC::get($query);

        MC::close();
        $db->disconnect();
        unset($db);

        return $data;


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

            $query = "SELECT * FROM wp_posts
            WHERE post_status='publish'
            AND post_type='page'
            ORDER BY ".$sort."
            LIMIT ".$start.",".$total;

        } else {

            $query = "SELECT * FROM wp_posts
            WHERE post_status='page'
            AND post_type='post'
            ORDER BY ".$sort."
            LIMIT ".$start.",".$total;

        }

        if(MC::get($query) == null){

            echo 'reading from db ';

            $db = new DB();
            $db->connect(self::$DB_USERNAME, self::$DB_PASSWORD, self::$DB_HOST, self::$DB_NAME);
            $result = mysql_query($query) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){

                $post = new Post($row);
                $this->pages[] = $post;
                MC::set('page'.$post->id, $post);

            }

            $db->disconnect();
            unset($db);

            MC::set($query, $this->pages);
        }

        $data = MC::get($query);
        MC::close();

        return $data;
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

}
?>
