<?php
	$path = explode('/', $_SERVER["REQUEST_URI"]);
	$section = $path[count($path) - 1];

	$id = -1;
	$title = '';

	if($section == 'blog') {
		$id = 3;
		$title = 'Blog - ';
	}

	if($section == 'portfolio') {
		$id = 7;
		$title = 'Portfolio - ';
	}

	if($section == 'about') {
		$id = 0;
		$title = 'About - ';
	}

	if($section == 'contact') {
		$id = 0;
		$title = 'Contact - ';
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
		<link href='http://fonts.googleapis.com/css?family=Droid+Sans' rel='stylesheet' type='text/css' />
		<link rel="icon" href="/favicon.ico" />
		<link rel="stylesheet" href="/assets/css/reset.css" />
		<link rel="stylesheet" href="/assets/css/layout.css" />
		<link rel="stylesheet" href="/assets/css/navigation.css" />
		<link rel="stylesheet" href="/assets/css/portfolio.css" />
		<link rel="stylesheet" href="/assets/css/about.css" />
		<link rel="stylesheet" href="/assets/css/blog.css" />
		<link rel="stylesheet" type="text/css" media="only screen and (max-device-width: 480px)" href="/assets/css/mobile.css" />

		<script src="/assets/js/libs/modernizr-2.0.6.min.js"></script>
	</head>

	<body>
		<header class="navigation">
			<nav>
				<!--<img src="http://vps.72lions.com/wp-content/themes/wordfolio/images/001/logo.png" alt="72Lions logo" />-->
				<ul class="clearfix">
					<li><a href="category/blog" class="nav-blog" title="Blog">Blog</a></li>
					<li><a href="category/experiments" class="nav-experiments" title="Experiments">Experiments</a></li>
					<li><a href="category/portfolio" class="nav-portfolio" title="Portfolio">Portfolio</a></li>
					<li><a href="about" class="nav-about" title="About">About</a></li>
					<li><a href="contact" class="nav-contact" title="Contact">Contact</a></li>
				</ul>
			</nav>
		</header>
		<div id="wrapper">
			<div id="sections-wrapper">
				<div class="seo">
					<ul>
					<?php
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

						$posts = $api->getPosts($id, $s, $t, $srt);
						$totalPosts = count($posts);

						for ($i=0; $i < $totalPosts; $i++) {
							$post = $posts[$i];
							$link = date('Y/m', strtotime($post->pubDate)).'/'.$post->slug;
							$postCategories = $post->categories;
							$totalCategories = count($postCategories);
							$categoriesHTML = '';
							for ($s=0; $s < totalCategories ; $s++) {
								$pc = $postCategories[$s];
								$categoriesHTML .= $pc->name;
								if ($s < totalCategories - 1){
									$categoriesHTML .= ',';
								}
							}
							echo '	<li>
										<a href="'.$link.'" title="'.$post->title.'">'.$post->title.'</a>
										<time>'.$post->pubDate.'</time>
										<p>'.$post->description.'</p>
										<p>'.$categoriesHTML.'</p>
									</li>';
						}
					?>
					</ul>
				</div>
				<section class="post-details clearfix">
					<div class="centered">
						<div class="left">this is left</div>
						<div class="column">
						<div class="column">
							<p>72Lions was started by  Thodoris Tsiridis a Web Developer from Greece. He is specialized in web development.</p>

							<p>"I bring a wide-ranging expertise with one sole purpose; to design &amp; develop interactive websites and applications.</p>

							<p>Every project I undertake is another challenge for me and I constantly bring innovative ideas in order to broaden my technical expertise.</p>
						</div>
						<div class="column">
							<p>I like to combine several technologies, such as Flash, AS3, XML, PHP-MySQL, but I also like to play with Web Services, ASP.NET.</p>

							<p>Whatever the project I am working on, the approach remains the same: putting the client’s needs first and enjoying the work I do by injecting quality and creativity into every stage in the process."</p>

							<p>Contact: info(at)72lions.com
						</div>
						</div>
					</div>
				</section>

				<section class="blog active">
					<div class="centered">
						<ul>
						</ul>
					</div>
				</section>

				<section class="portfolio">
					<div class="centered">
						<ul>
							<noscript>

							</noscript>
						</ul>
					</div>
				</section>

				<section class="experiments">
					<div class="centered">
						<hgroup>
							<h1>Experiments</h1>
						</hgroup>
					</div>
				</section>

				<section class="contact">
					<div class="centered">
						<hgroup>
							<h1>Contact</h1>
						</hgroup>
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
		<script type="text/javascript" src="/assets/js/router.js"></script>
		<script type="text/javascript" src="/assets/js/eventtarget.js"></script>

		<!-- source scripts -->
		<script type="text/javascript" src="/assets/js/namespaces.js"></script>
		<script type="text/javascript" src="/assets/js/models/locale_en.js"></script>
		<script type="text/javascript" src="/assets/js/controllermanager.js"></script>
		<script type="text/javascript" src="/assets/js/lookup.js"></script>
		<script type="text/javascript" src="/assets/js/console.js"></script>
		<script type="text/javascript" src="/assets/js/componentloader.js"></script>

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
		<!-- end source scripts-->

		<!-- scripts concatenated and minified via build script -->
		<!--<script defer src="js/72lions.merged.min.js"></script>-->
		<!-- end scripts -->
		<!--
		<script>
		var _gaq=[['_setAccount','UA-3983098-4'],['_trackPageview'],['_trackPageLoadTime']];
		(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
		g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
		s.parentNode.insertBefore(g,s)}(document,'script'));
		</script>
		-->
		<!--[if lt IE 7 ]>
		<script defer src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
		<script defer>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
		<![endif]-->

	</body>
</html>
