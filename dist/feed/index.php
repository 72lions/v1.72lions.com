<?php
    header ("Content-Type:text/xml");

    include('../api/classes/db.php');
    include('../api/classes/api.php');
    include('../api/classes/post.php');
    include('../api/classes/category.php');
    include('../api/classes/mc.php');

    if(MC::get('rss') == null ) {

        $api = new API();

        // Make sure to get all the posts
        $posts = $api->getPosts(null, 0, 2000, Post::$SORT_DATE_DESC);

        $totalPosts = count($posts);

        $rss = '<?xml version="1.0"?>
                <rss version="2.0">
                  <channel>
                    <title>72lions - The playground of developer Thodoris Tsiridis</title>
                    <link>http://72lions.com</link>
                    <description>My name is Thodoris Tsiridis and I am a web developer from Greece. I am currently living a great life in Stockholm, Sweden!</description>
                    <language>en-us</language>
                    <pubDate>' . date(DATE_RFC822) .'</pubDate>
                    <lastBuildDate>'. date(DATE_RFC822) . '</lastBuildDate>
                    <docs>http://72lions.com/feed/</docs>
                    <generator>72lions.com</generator>
                    <managingEditor>info@72lions.com</managingEditor>
                    <webMaster>info@72lions.com</webMaster>
                    <image>
                        <url>http://72lions.com/assets/images/logo.png</url>
                        <title>72lions.com</title>
                        <link>http://72lions.com</link>
                    </image>';

            for ($i=0; $i < $totalPosts ; $i++) {

                // Used to create the link
                $dateSegments = explode('-', date('m-d', strtotime($posts[$i]->pubDate)));
                $month = $dateSegments[0];
                $date = $dateSegments[1];
                $link = 'http://72lions.com/'. $month .'/'. $date . '/' . $posts[$i]->slug;

                $rss .= '<item>
                          <title>'. $posts[$i]->title .'</title>
                          <link>'. $link .'</link>
                          <link rel="enclosure" type="image/jpeg" href="http://72lions.com/wp-content/uploads/'.$posts[$i]->thumbnail['File'].'" />
                          <description><![CDATA['. $posts[$i]->description .']]></description>
                          <pubDate>'. date(DATE_RFC822, strtotime($posts[$i]->pubDate)) .'</pubDate>
                          <guid>'. $link .'</guid>
                        </item>';
            }

            $rss .= '</channel>';
        $rss .= '</rss>';

        MC::set('rss', $rss);

    } else {

        $rss = MC::get('rss');

    }

    echo $rss;
?>

