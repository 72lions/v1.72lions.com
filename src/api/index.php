<?php

  include('api.php');



  $USERNAME = "admin";
  $PASSWORD = "m$&8lAWi";

  $api = new API("http://72lions.com/xmlrpc.php", $USERNAME, $PASSWORD );
  $api->getRecentPosts(10);

?>