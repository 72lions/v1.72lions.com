<?php
class API {

    var $username = '';
    var $password = '';
    var $url = '';
    var $curlHandle = null;

    public function __construct($url, $username, $password){

        $this->username = $username;
        $this->password =  $password;
        $this->url =  $url;
    }

    function get_response($context) {

        if(!function_exists('curl_init')) {
            die ("Curl PHP package not installed\n");
        }

        /*Initializing CURL*/
        $this->curlHandle = curl_init();

        /*The URL to be downloaded is set*/
        curl_setopt($this->curlHandle, CURLOPT_URL, $this->url);
        curl_setopt($this->curlHandle, CURLOPT_HEADER, false);
        curl_setopt($this->curlHandle, CURLOPT_HTTPHEADER, array("Content-Type: text/xml"));
        curl_setopt($this->curlHandle, CURLOPT_POSTFIELDS, $context);

        /*Now execute the CURL, download the URL specified*/
        $response = curl_exec($this->curlHandle);
        return $response;
    }

    function getRecentPosts($max_count) {
        /*Creating the wp.getUsersBlogs request which takes on two parameters
        username and password*/
        $request = xmlrpc_encode_request("metaWeblog.getRecentPosts", array(1, $this->username, $this->password, $max_count));

        /*Making the request to wordpress XMLRPC of your blog*/
        $xmlresponse = $this->get_response($request);
        $response = xmlrpc_decode($xmlresponse);

        if ($response && xmlrpc_is_fault($response)) {
            trigger_error("xmlrpc: $response[faultString] ($response[faultCode])");
            return null;
        } else {
            /*Printing the response on to the console*/
            return $response;
        }
    }

}
?>