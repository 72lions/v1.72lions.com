<!DOCTYPE HTML>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <?php
        /*header ("Content-Type:text/xml");
        include('api.php');

        $USERNAME = "admin";
        $PASSWORD = "m$&8lAWi";

        $api = new API("http://72lions.com/xmlrpc.php", $USERNAME, $PASSWORD );
        $response = $api->getRecentPosts(10);
        print_r($response);*/

        include('xmlapi.php');
        include('post.php');
        include('category.php');
        include('mc.php');

        $api = new API();
        $api->parseXML('../data/wp-data.xml');
        $categories = $api->getPosts(4, 3, 0);
        print_r($categories);
    ?>
</body>
</html>