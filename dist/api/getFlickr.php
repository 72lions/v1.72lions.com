<?php
    header ("Content-Type:text/plain");

    include('classes/mc.php');
    include('classes/flickrfetcher.php');

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

?>
