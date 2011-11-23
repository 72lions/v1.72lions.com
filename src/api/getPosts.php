<?php
    header ("Content-Type:text/plain");

    include('classes/db.php');
    include('classes/api.php');
    include('classes/post.php');
    include('classes/mc.php');

    // Get all the post/get variables
    if(isset($_REQUEST['cid'])) { $cid = (int)$_REQUEST['cid']; } else { $cid = null; }
    if(isset($_REQUEST['s'])) { $s = (int)$_REQUEST['s']; } else { $s = 0; }
    if(isset($_REQUEST['t'])) { $t = (int)$_REQUEST['t']; } else { $t = 10; }
    if(isset($_REQUEST['srt'])) { $srt = $_REQUEST['srt']; } else { $srt = Post::$SORT_DATE_DESC; }

    $api = new API();

    $posts = $api->getPosts($cid, $s, $t, $srt);

    $totalPosts = count($posts);

    // Create the JSON object
    echo '{ "Results":[';
    for ($i=0; $i < $totalPosts; $i++) {

        $data = array();
        $data['Title'] = $posts[$i]->title;
        $data['Content'] = $posts[$i]->content;
        $data['Link'] = $posts[$i]->link;
        $data['PublishDate'] = $posts[$i]->pubDate;
        $data['Creator'] = $posts[$i]->creator;
        $data['Description'] = $posts[$i]->description;
        $data['Id'] = $posts[$i]->id;

        echo json_encode($data);

        if($i < $totalPosts-1){
            echo ',';
        }
    }

    echo ']}';

?>
