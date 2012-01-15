<?php
    header ("Content-Type:text/plain");

    include('classes/db.php');
    include('classes/api.php');
    include('classes/post.php');
    include('classes/category.php');
    include('classes/mc.php');

    // Get all the post/get variables
    if(isset($_REQUEST['id'])) { $id = $_REQUEST['id']; } else { $id = null; }

    $api = new API();

    $post = $api->getPostDetails($id);

    // Create the JSON object
    echo '{ "Results":';


    $data = array();
    $dataCategories = array();

    $data['Title'] = $post->title;
    $data['Content'] = $post->content;
    $data['Slug'] = $post->slug;
    $data['Link'] = $post->link;
    $data['PublishDate'] = $post->pubDate;
    $data['Creator'] = $post->creator;
    $data['Description'] = $post->description;
    $data['Id'] = $post->id;
    $data['Thumbnail'] = $post->thumbnail;
    $data['Meta'] = $post->meta;
    $data['Tags'] = $post->tags;

    for ($d=0; $d < count($post->categories); $d++) {
        $category = $post->categories[$d];
        $dataCategories[$d] = array();
        $dataCategories[$d]['Name'] = $category->name;
        $dataCategories[$d]['Slug'] = $category->slug;
        $dataCategories[$d]['Id'] = $category->id;
    }

    $data['Categories'] = $dataCategories;

    echo json_encode($data);


    echo '}';

?>
