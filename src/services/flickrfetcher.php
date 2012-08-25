<?php
/**
 * Responsible for fetching the flickr photos from a specific account
 *
 * @module 72lionsPHP
 * @class FlicrFetcher
 * @author Thodoris Tsiridis
 * @version 1.0
 */
class FlickrFetcher {

    /**
     * The URL of the Twitter API
     * @type String
     * @default 'http://api.flickr.com/services/feeds/photos_public.gne'
     */
     public $url = "http://api.flickr.com/services/feeds/photos_public.gne";


    /**
     * The data returned from the Twitter API
     * @type String
     */
     public $data = '';

    /**
     * The username of the account that we want to read the tweets
     *
     * @private
     * @type String
     * @default '42655232@N02'
     */
     protected $username = '42655232@N02';

    /**
     * Returns the flickr json from the apI
     *
     * @return {String} The photos in a JSON format
     * @author Thodoris Tsiridis
     */
    public function getPhotos() {

        // Set the url from where to load the feeds
        $feed = $this->url . "?id=" . $this->username . "&format=json&jsoncallback=?";

        // Read the data from the url
        $this->data = file_get_contents($feed, 0, null, null);

        // Remove the extra parentheses that the Flickr API adds
        $this->data = ltrim($this->data, '(');
        $this->data = rtrim($this->data, ')');

        return $this->data;
    }

}
?>
