<?php
    header ("Content-Type:text/plain");

    include('classes/mc.php');

    // Check if we have it in cache
    if(MC::get('latestTweets') == null){

        // If its not in cache then get the number of total posts to show
        if(isset($_REQUEST['t'])){ $num = $_REQUEST['t']; } else { $num = 2; }

        // Set the username
        $username = "72lions";

        // Set the url from where to load the feeds
        $feed = "http://search.twitter.com/search.json?q=from:" . $username . "&result_type=mixed&rpp=" . $num;

        // Read the data from the url
        $data = file_get_contents($feed, 0, null, null);

        // Cache the data with an expiration of 30 minutes
        MC::set('latestTweets', $data, 1800);

    } else {

        // If the data are cached then read them from the cache
        $data = MC::get('latestTweets');

    }

    echo $data;

?>
