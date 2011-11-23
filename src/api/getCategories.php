<?php
    header ("Content-Type:text/plain");

    include('classes/db.php');
    include('classes/api.php');
    include('classes/category.php');
    include('classes/mc.php');

    if(isset($_REQUEST['s'])) { $s = (int)$_REQUEST['s']; } else { $s = 0; }
    if(isset($_REQUEST['t'])) { $t = (int)$_REQUEST['t']; } else { $t = 10; }
    if(isset($_REQUEST['srt'])) { $srt = $_REQUEST['srt']; } else { $srt = Category::$SORT_NAME_ASC; }

    $api = new API();

    $categories = $api->getCategories($s, $t, $srt);

    $total = count($categories);

    // Create the JSON object
    echo '{ "Results":[';
    for ($i=0; $i < $total; $i++) {

        $data = array();
        $data['Name'] = $categories[$i]->name;
        $data['Slug'] = $categories[$i]->slug;
        $data['Id'] = $categories[$i]->id;

        echo json_encode($data);

        if($i < $total-1){
            echo ',';
        }
    }

    echo ']}';
?>
