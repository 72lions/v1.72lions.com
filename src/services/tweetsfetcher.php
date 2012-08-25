<?php
/**
 * Responsible for fetching the Tweets from a specific account
 *
 * @module 72lionsPHP
 * @class TweetsFetcher
 * @author Thodoris Tsiridis
 * @version 1.0
 */
class TweetsFetcher {

    /**
     * The URL of the Twitter API
     * @type String
     * @default 'http://search.twitter.com/search.json'
     */
     public $url = "http://search.twitter.com/search.json";


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
     * @default '72lions'
     */
     protected $username = '72lions';

    /**
     * Returns the tweets from the Twitter API in JSON format.
     *
     * @param {Number} $t The total tweets to fetch
     * @return {String} The tweets in a JSON format
     * @author Thodoris Tsiridis
     */
    public function getTweets($t = 2) {

        // Set the url from where to load the feeds
        $feed = $this->url . "?q=from:" . $this->username . "&result_type=mixed&rpp=" . $t;

        // Read the data from the url
        $this->data = file_get_contents($feed, 0, null, null);

        return $this->data;
    }

}
?>
