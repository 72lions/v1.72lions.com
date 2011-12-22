<?php
    header ("Content-Type:text/plain");

    include('classes/mc.php');

    if(MC::get('latestTweets') == null){

        if(isset($_REQUEST['t'])){ $num = $_REQUEST['t']; } else { $num = 2; }

        $username = "72lions";
        $feed = "http://search.twitter.com/search.json?q=from:" . $username . "&result_type=mixed&rpp=" . $num;
        $data = file_get_contents($feed, 0, null, null);
        MC::set('latestTweets', $data, 1800);

    } else {
        $data = MC::get('latestTweets');

    }

    echo $data;

?>
