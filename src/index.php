<?php
	$path = explode('/', $_SERVER["REQUEST_URI"]);
	$section = $path[count($path) - 1];

	$id = -1;
	$title = '';

	if($section == 'blog'|| $section == '') {
		$id = 3;
		$title = 'Blog - ';
	} else if($section == 'portfolio') {
		$id = 7;
		$title = 'Portfolio - ';
	} else if($section == 'about') {
		$id = 0;
		$title = 'About - ';
	} else if($section == 'contact') {
		$id = 0;
		$title = 'Contact - ';
	} else {
		$id = $section;
	}

	$seoMarkup = '';

	include('api/classes/db.php');
	include('api/classes/api.php');
	include('api/classes/post.php');
	include('api/classes/category.php');
	include('api/classes/mc.php');

	// Get all the post/get variables
	$s = 0;
	$t = 10;
	$srt = Post::$SORT_DATE_DESC;

	$api = new API();

	// If the id is a number then it means that we are in a category
	if(is_numeric($id) || $id === '') {

		$posts = $api->getPosts($id, $s, $t, $srt);
		$totalPosts = count($posts);
		$seoMarkup .= '<ul>';

		for ($i=0; $i < $totalPosts; $i++) {
			$post = $posts[$i];
			$link = date('Y/m', strtotime($post->pubDate)).'/'.$post->slug;

			$postCategories = $post->categories;
			$totalCategories = count($postCategories);
			$categoriesHTML = '';
			for ($s=0; $s < $totalCategories ; $s++) {
				$pc = $postCategories[$s];
				$categoriesHTML .= $pc->name;
				if ($s < $totalCategories - 1){
					$categoriesHTML .= ',';
				}
			}

			$seoMarkup .= '	<li>
						<a href="'.$link.'" title="'.$post->title.'">'.$post->title.'</a>
						<time>'.$post->pubDate.'</time>
						<p>'.$post->description.'</p>
						<p>'.$categoriesHTML.'</p>
					</li>';
		}

		$seoMarkup .= '</ul>';

	} else {

		$post = $api->getPostDetails($id);
	    $title = $post->title . ' - ';
		$description = $post->description;

		$postCategories = $post->categories;
		$totalCategories = count($postCategories);
		$categoriesHTML = '';

		for ($s=0; $s < $totalCategories ; $s++) {
			$pc = $postCategories[$s];
			$categoriesHTML .= $pc->name;
			if ($s < $totalCategories - 1){
				$categoriesHTML .= ',';
			}
		}

	    $seoMarkup .= '<h1>'.$post->title.'</h1>';
	    $seoMarkup .='<time>'.$post->pubDate.'</time>';
		$seoMarkup .= 'Categories: '. $categoriesHTML;
		$seoMarkup .= '<div class="text">'.$post->content.'</div>';
	}

?>
<!doctype html>
<html class="no-js" lang="en">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

		<title><?php echo $title;?>72Lions - Thodoris Tsiridis - Web developer</title>
		<meta name="description" content="" />
		<meta name="author" content="" />

		<!-- Mobile viewport optimized: j.mp/bplateviewport -->
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<!-- For iPhone 4 with high-resolution Retina display: -->
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="apple-touch-icon-114x114-precomposed.png">
		<!-- For first-generation iPad: -->
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="apple-touch-icon-72x72-precomposed.png">
		<!-- For non-Retina iPhone, iPod Touch, and Android 2.1+ devices: -->
		<link rel="apple-touch-icon-precomposed" href="apple-touch-icon-precomposed.png">

		<!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->
		<link href='http://fonts.googleapis.com/css?family=Oswald' rel='stylesheet' type='text/css'>
		<link rel="icon" href="/favicon.ico" />

		<!--source css-->
		<link rel="stylesheet" href="/assets/css/reset.css" />
		<link rel="stylesheet" href="/assets/css/ui.css" />
		<link rel="stylesheet" href="/assets/css/layout.css" />
		<link rel="stylesheet" href="/assets/css/navigation.css" />
		<link rel="stylesheet" href="/assets/css/portfolio.css" />
		<link rel="stylesheet" href="/assets/css/about.css" />
		<link rel="stylesheet" href="/assets/css/blog.css" />
		<link rel="stylesheet" href="/assets/css/postdetails.css" />
		<!--end source css-->

		<link rel="stylesheet" type="text/css" media="only screen and (max-device-width: 480px)" href="/assets/css/mobile-hires.css" />

		<script src="/assets/js/libs/modernizr-2.0.6.min.js"></script>

		<script type="text/javascript">

		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-3983098-4']);
		  _gaq.push(['_trackPageview']);

		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();

		</script>

	</head>

	<body>
		<header class="navigation">
			<div class="logo-container">
				<a href="#" title="72lions.com Homepage" class="logo">
					<img src="/assets/images/logo.png" alt="72lions logo" />
				</a>
				<h1>
					Welcome to my playground
				</h1>
				<p>
					My name is Thodoris Tsiridis and I am a web developer from Greece. <br/>I am currently living a great life in Stockholm, Sweden!
				</p>
			</div>
			<nav>
				<!--<img src="http://vps.72lions.com/wp-content/themes/wordfolio/images/001/logo.png" alt="72Lions logo" />-->
				<ul class="clearfix">
					<li><a href="category/blog" class="nav-blog" title="Blog">Blog</a></li>
					<!--<li><a href="category/experiments" class="nav-experiments" title="Experiments">Experiments</a></li>-->
					<li><a href="category/portfolio" class="nav-portfolio" title="Portfolio">Portfolio</a></li>
					<li><a href="about" class="nav-about" title="About">About</a></li>
				</ul>
			</nav>
		</header>
		<div id="wrapper">
			<div id="sections-wrapper">
				<div class="seo">
					<?php
						echo $seoMarkup;
					?>
				</div>
				<section class="post-details clearfix">
					<div class="centered clearfix">
						<div class="content">
							<h1 class="title"></h1>
							<time></time>
							<div class="categories"></div>
							<a href="#" class="github-link" target="_blank"><span>Fork it on Github</span></a>
							<a href="#" class="download-link" target="_blank"><span>Download</span></a>
							<a href="#" class="demo-link" target="_blank"><span>Demo</span></a>
							<div class="text"></div>
							<div class="comments">
									<div id="disqus_thread"></div>
									<script type="text/javascript">
									    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
									    var disqus_shortname = '72lions'; // required: replace example with your forum shortname
										var disqus_developer = 1;

									    /* * * DON'T EDIT BELOW THIS LINE * * */
									    (function() {
									        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
									        dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
									        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
									    })();
									</script>
									<noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
									<a href="http://disqus.com" class="dsq-brlink">blog comments powered by <span class="logo-disqus">Disqus</span></a>
							</div>
						</div>
					</div>
				</section>

				<section class="blog active">
					<div class="centered">

					</div>
				</section>

				<section class="portfolio">
					<div class="centered">
					</div>
				</section>

			</div>
			<footer>

			</footer>
		</div>
		<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
		<!--
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="/assets/js/libs/jquery-1.6.4.min.js"><\/script>')</script>
 		-->

 		<script type="text/javascript" src="/assets/js/libs/jquery-1.6.4.min.js"></script>
		<script type="text/javascript" src="/assets/js/libs/jquery.easing.1.3.js"></script>

 		<!--source scripts-->
		<script type="text/javascript" src="/assets/js/router.js"></script>
		<script type="text/javascript" src="/assets/js/eventtarget.js"></script>

		<script type="text/javascript" src="/assets/js/namespaces.js"></script>
		<script type="text/javascript" src="/assets/js/models/locale_en.js"></script>
		<script type="text/javascript" src="/assets/js/controllermanager.js"></script>
		<script type="text/javascript" src="/assets/js/lookup.js"></script>
		<script type="text/javascript" src="/assets/js/console.js"></script>

		<script type="text/javascript" src="/assets/js/controllers/base.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/main.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/navigation.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/sectionsmanager.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/portfolio.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/experiments.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/blog.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/about.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/contact.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/thumbnailitem.js"></script>
		<script type="text/javascript" src="/assets/js/controllers/postdetails.js"></script>

		<script type="text/javascript" src="/assets/js/models/base.js"></script>
		<script type="text/javascript" src="/assets/js/models/categories.js"></script>
		<script type="text/javascript" src="/assets/js/models/posts.js"></script>

		<script type="text/javascript" src="/assets/js/views/base.js"></script>
		<script type="text/javascript" src="/assets/js/views/main.js"></script>
		<script type="text/javascript" src="/assets/js/views/navigation.js"></script>
		<script type="text/javascript" src="/assets/js/views/sectionsmanager.js"></script>
		<script type="text/javascript" src="/assets/js/views/portfolio.js"></script>
		<script type="text/javascript" src="/assets/js/views/experiments.js"></script>
		<script type="text/javascript" src="/assets/js/views/blog.js"></script>
		<script type="text/javascript" src="/assets/js/views/about.js"></script>
		<script type="text/javascript" src="/assets/js/views/contact.js"></script>
		<script type="text/javascript" src="/assets/js/views/thumbnailitem.js"></script>
		<script type="text/javascript" src="/assets/js/views/postdetails.js"></script>

		<script type="text/javascript" src="/assets/js/bootstrap.js"></script>
		<!--end source scripts-->

		<!--[if lt IE 7 ]>
		<script defer src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
		<script defer>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
		<![endif]-->

	</body>
</html>
