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
     *
     * @param {Number} $start The beginning of the result set
     * @param {Number} $total The total items to laod
     * @param {String} $sort The sorting
     * @return {Array}
     * @author Thodoris Tsiridis
     */
    public function getCategories($start = 0, $total = 10, $sort = 'name ASC') {

        $query = "SELECT WT.* FROM wp_terms WT, wp_term_taxonomy WTT
                WHERE WT.term_id =  WTT.term_id
                AND taxonomy='category'
                ORDER BY WT.".$sort."
                LIMIT ".$start.",".$total;

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

            unset($result);
        }

        return MC::get($query);
    }

    /**
     * Returns an array with all the posts
     *
     * @param {Number} $categoryId The id of the parent category
     * @param {Number} $start The beginning of the result set
     * @param {Number} $total The total items to laod
     * @param {String} $sort The sorting
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

                // Create a post
                $post = $this->createPostObject($row);
                $this->posts[] = $post;

                MC::set('post'.$post->id, $post);
                MC::set($post->slug, $post);

            }

            unset($result);
            MC::set($query, $this->posts);
        }

        $db->disconnect();
        unset($db);

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

            $db = new DB();
            $db->connect(self::$DB_USERNAME, self::$DB_PASSWORD, self::$DB_HOST, self::$DB_NAME);
            $result = mysql_query($query) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){

                $post = new Post($row);
                $this->pages[] = $post;
                MC::set('page'.$post->id, $post);
                MC::set($post->slug, $post);

            }

            $db->disconnect();
            unset($db);

            MC::set($query, $this->pages);
        }

        return MC::get($query);
    }

    /**
     * Gets the details of a post
     *
     * @param {Number} $postId The id of the post that we want to get the details
     * @return {Object}
     * @author Thodoris Tsiridis
     */
    public function getPostDetails($postId) {

        if(MC::get($postId) == null) {

            $db = new DB();
            $db->connect(self::$DB_USERNAME, self::$DB_PASSWORD, self::$DB_HOST, self::$DB_NAME);

            $query = "SELECT * FROM wp_posts
            WHERE post_status='publish'
            AND (post_type='post' || post_type='page')
            AND post_name='".mysql_real_escape_string($postId)."'";
            echo $query;
            $result = mysql_query($query) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
            $row = mysql_fetch_array($result, MYSQL_ASSOC);
            $total = mysql_num_rows($result);

            if($total > 0) {

                $post = $this->createPostObject($row);

                if($row['post_type'] === 'post'){
                    MC::set('post'.$post->id, $post);
                } else {
                    MC::set('page'.$post->id, $post);
                }

                MC::set($post->slug, $post);
            }

            $db->disconnect();
            unset($db);

        }

        return MC::get($postId);

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

    protected function createPostObject($row) {

        $post = new Post($row);

        // Get the attachments
        $queryAt = "SELECT * FROM wp_postmeta
        WHERE post_id=".$row['ID'];

        $resultAt = mysql_query($queryAt) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
        while($rowAt = mysql_fetch_array($resultAt, MYSQL_ASSOC)){

            //Get the thumbnail
            if($rowAt['meta_key'] === '_thumbnail_id') {

                $queryThumbnail = "SELECT * FROM wp_postmeta
                WHERE post_id=" . $rowAt['meta_value'];

                $resultTh = mysql_query($queryThumbnail) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
                while($rowTh = mysql_fetch_array($resultTh, MYSQL_ASSOC)){

                    if($rowTh['meta_key'] === '_wp_attached_file') {
                        $post->thumbnail['File'] = $rowTh['meta_value'];
                    }

                    if($rowTh['meta_key'] === '_wp_attachment_metadata') {
                        $post->thumbnail['Data'] = unserialize($rowTh['meta_value']);
                    }

                }

                unset($resultTh);

            } else {
                // Get the rest of the data
                $post->addMeta($rowAt['meta_key'], $rowAt['meta_value']);
            }


        }

        // Get the categories
        $queryCats = "SELECT WT.* FROM wp_terms WT, wp_term_taxonomy WTT, wp_term_relationships WPTR
        WHERE WT.term_id =  WTT.term_id
        AND WPTR.term_taxonomy_id = WTT.term_taxonomy_id
        AND WPTR.object_id = ".$post->id."
        AND WTT.taxonomy='category'
        ORDER BY WT.name ASC";

        $resultCats = mysql_query($queryCats) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
        while($rowCat = mysql_fetch_array($resultCats, MYSQL_ASSOC)){

            if(MC::get('category'.$rowCat['term_id']) == null){

                $category = new Category($rowCat);
                Category::addCategory($category);
                MC::set('category'.$category->id, $category);

            }

            $post->addToCategory(MC::get('category'.$rowCat['term_id']));
        }

        unset($resultCats);
        unset($resultAt);

        return $post;
    }

}
?>
