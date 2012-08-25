<?php

    error_reporting(E_ALL ^ E_NOTICE);

    header ("Content-Type:text/plain");

    include('../wordpress-api/db/mysql_db.php');
    include('../wordpress-api/wp_api.php');
    include('../wordpress-api/wp_categories.php');
    include('../wordpress-api/wp_category.php');
    include('../wordpress-api/wp_post.php');
    include('../wordpress-api/cache/base_cache_interface.php');
    include('../wordpress-api/cache/memcache_interface.php');
    include('classes/flickrfetcher.php');
    include('classes/tweetsfetcher.php');

    if(isset($_GET['posts']) || isset($_GET['tag'])){

        // Get all the post/get variables
        if(isset($_REQUEST['cid'])) { $cid = (int)$_REQUEST['cid']; } else { $cid = null; }
        if(isset($_REQUEST['tid'])) { $tid = (int)$_REQUEST['tid']; } else { $tid = null; }
        if(isset($_REQUEST['s'])) { $s = (int)$_REQUEST['s']; } else { $s = 0; }
        if(isset($_REQUEST['t'])) { $t = (int)$_REQUEST['t']; } else { $t = 10; }
        if(isset($_REQUEST['srt'])) { $srt = $_REQUEST['srt']; } else { $srt = WpPost::$SORT_DATE_DESC; }

        $api = new WpApi();

        $posts = $api->getPosts($cid, $tid, $s, $t, $srt);

        $totalPosts = count($posts);

        // Create the JSON object
        echo '{ "Results":[';
        for ($i=0; $i < $totalPosts; $i++) {

            $data = array();
            $dataCategories = array();

            $data['Title'] = $posts[$i]->title;
            $data['Content'] = $posts[$i]->content;
            $data['Slug'] = $posts[$i]->slug;
            $data['Link'] = $posts[$i]->link;
            $data['PublishDate'] = $posts[$i]->pubDate;
            $data['Creator'] = $posts[$i]->creator;
            $data['Description'] = $posts[$i]->description;
            $data['Id'] = $posts[$i]->id;
            $data['Thumbnail'] = $posts[$i]->thumbnail;
            $data['Meta'] = $posts[$i]->meta;
            $data['Tags'] = $posts[$i]->tags;

            for ($d=0; $d < count($posts[$i]->categories); $d++) {
                $category = $posts[$i]->categories[$d];
                $dataCategories[$d] = array();
                $dataCategories[$d]['Name'] = $category->name;
                $dataCategories[$d]['Slug'] = $category->slug;
                $dataCategories[$d]['Id'] = $category->id;
            }

            $data['Categories'] = $dataCategories;

            echo json_encode($data);

            if($i < $totalPosts-1){
                echo ',';
            }
        }

        echo ']}';
    }

    if(isset($_GET['postdetails'])){

        // Get all the post/get variables
        if(isset($_REQUEST['id'])) { $id = $_REQUEST['id']; } else { $id = null; }

        $api = new wpApi();

        $post = $api->getPostDetails($id);

        // Create the JSON object
        echo '{ "Results":';


        $data = array();
        $dataCategories = array();

        $data['Title'] = $post->title;
        $data['Content'] = $post->content;
        $data['Slug'] = $post->slug;
        $data['Link'] = $post->link;
        $data['PublishDate'] = $post->pubDate;
        $data['Creator'] = $post->creator;
        $data['Description'] = $post->description;
        $data['Id'] = $post->id;
        $data['Thumbnail'] = $post->thumbnail;
        $data['Meta'] = $post->meta;
        $data['Tags'] = $post->tags;

        for ($d=0; $d < count($post->categories); $d++) {
            $category = $post->categories[$d];
            $dataCategories[$d] = array();
            $dataCategories[$d]['Name'] = $category->name;
            $dataCategories[$d]['Slug'] = $category->slug;
            $dataCategories[$d]['Id'] = $category->id;
        }

        $data['Categories'] = $dataCategories;

        echo json_encode($data);


        echo '}';
    }

    if(isset($_GET['categories'])){

        if(isset($_REQUEST['s'])) { $s = (int)$_REQUEST['s']; } else { $s = 0; }
        if(isset($_REQUEST['t'])) { $t = (int)$_REQUEST['t']; } else { $t = 10; }
        if(isset($_REQUEST['srt'])) { $srt = $_REQUEST['srt']; } else { $srt = WpCategory::$SORT_NAME_ASC; }

        $api = new wpApi();

        $categories = $api->getCategories($s, $t, $srt);

        $total = count($categories);

        // Create the JSON object
        echo '{ "Results":[';
        for ($i=0; $i < $total; $i++) {

            $data = array();
            $data['Name'] = $categories[$i]->name;
            $data['Slug'] = $categories[$i]->slug;
            $data['Id'] = $categories[$i]->id;

            echo json_encode($data);

            if($i < $total-1){
                echo ',';
            }
        }

        echo ']}';
    }

    if(isset($_GET['flickr'])){
        // Check if we have it in cache
        if(MC::get('flickr') == null){

            $ff = new FlickrFetcher();
            $data = $ff->getPhotos();

            // Cache the data with an expiration of 30 minutes
            MC::set('flickr', $data, 72000);

        } else {

            // If the data are cached then read them from the cache
            $data = MC::get('flickr');

        }

        echo $data;
    }

    if(isset($_GET['tweets'])){

        // Check if we have it in cache
        if(MC::get('latestTweets') == null){

            // If its not in cache then get the number of total posts to show
            if(isset($_REQUEST['t'])){ $num = $_REQUEST['t']; } else { $num = 2; }

            $tw = new TweetsFetcher();
            $data = $tw->getTweets($num);

            // Cache the data with an expiration of 30 minutes
            MC::set('latestTweets', $data, 1800);

        } else {

            // If the data are cached then read them from the cache
            $data = MC::get('latestTweets');

        }

        echo $data;
    }

?>
