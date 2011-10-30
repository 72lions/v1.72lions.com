<?php
    header ("Content-Type:text/xml");
    include('api.php');



    $USERNAME = "admin";
    $PASSWORD = "m$&8lAWi";

    $api = new API("http://72lions.com/xmlrpc.php", $USERNAME, $PASSWORD );
    $response = $api->getRecentPosts(10);
    print_r($response);
?>