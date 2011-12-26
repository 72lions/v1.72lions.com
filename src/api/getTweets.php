<?php
    header ("Content-Type:text/plain");

    include('classes/mc.php');
    include('classes/tweetsfetcher.php');

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

?>
