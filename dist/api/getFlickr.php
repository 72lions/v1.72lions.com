<?php
    header ("Content-Type:text/plain");

    include('classes/mc.php');

        // Check if we have it in cache
    if(MC::get('flickr') == null){

        // Set the username
        $username = "42655232@N02";

        // Set the url from where to load the feeds
        $feed = "http://api.flickr.com/services/feeds/photos_public.gne?id=" . $username . "&format=json&jsoncallback=?";

        // Read the data from the url
        $data = file_get_contents($feed, 0, null, null);

        // Remove the extra parentheses that the Flickr API adds
        $data = ltrim($data, '(');
        $data = rtrim($data, ')');

        // Cache the data with an expiration of 30 minutes
        MC::set('flickr', $data, 72000);

    } else {

        // If the data are cached then read them from the cache
        $data = MC::get('flickr');

    }

    echo $data;

?>
