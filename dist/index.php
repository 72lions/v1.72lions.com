<?php
	$output = rtrim($_SERVER["REQUEST_URI"], '/');
	$path = explode('/', $output);
	$section = $path[count($path) - 1];

	if(count($path) === 4 && $section === '') {
		$section = $path[count($path) - 2];
	}

	$id = -1;
	$tid = null;
	$title = '';

	if($section == 'blog' || $section == '') {
		$id = 3;
		$description = 'My name is Thodoris Tsiridis and this is my blog. Here you can find all the things that I like to do and talk about';
		$title = 'Blog - ';
	} else if($section == 'experiments') {
		$id = 4;
		$description = 'My name is Thodoris Tsiridis and these are my experiments. Here you can find all my latest experiments!';
		$title = 'Experiments - ';
	} else if($section == 'portfolio') {
		$id = 7;
		$description = 'My name is Thodoris Tsiridis and this is my portfolio. Here you can find all my latest work!';
		$title = 'Portfolio - ';
	} else if($section == 'about') {
		$id = 0;
		$description = 'My name is Thodoris Tsiridis and I am a web developer from Greece. I am currently living a great life in Stockholm, Sweden!';
		$title = 'About - ';
	} else if($section == 'contact') {
		$id = 0;
		$description = 'My name is Thodoris Tsiridis and I am a web developer from Greece. I am currently living a great life in Stockholm, Sweden!';
		$title = 'Contact - ';
	} else if($path[1] == 'tag') {
		$id = null;
		$tid = $section;
		$section = $path[count($path) - 2];
		$description = 'My name is Thodoris Tsiridis and I am a web developer from Greece. I am currently living a great life in Stockholm, Sweden!';
		$title = 'Tag ' . $section . ' - ';
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
	if(is_numeric($id) || $id === '' || ($id === null && is_numeric($tid))) {

		$posts = $api->getPosts($id, $tid, $s, $t, $srt);

		$totalPosts = count($posts);
		$seoMarkup .= '<ul>';

		for ($i=0; $i < $totalPosts; $i++) {
			$post = $posts[$i];
			$link = '/' . date('Y/m', strtotime($post->pubDate)).'/'.$post->slug;

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

		<title><?php echo $title;?>72Lions - The playground of developer Thodoris Tsiridis</title>
		<meta name="description" content="<?php echo $description;?>" />
		<meta name="author" content="Thodoris Tsiridis" />

		<!-- Mobile viewport optimized: j.mp/bplateviewport -->
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

		<link rel="author" href="/humans.txt" />
		<link rel="alternate" type="application/rss+xml" title="72lions.com - The playground of Thodoris Tsirids" href="http://72lions.com/feed/" />

		<meta name="apple-mobile-web-app-capable" content="yes" />
		<!-- For iPhone 4 with high-resolution Retina display: -->
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="apple-touch-icon-114x114-precomposed.png">
		<!-- For first-generation iPad: -->
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="apple-touch-icon-72x72-precomposed.png">
		<!-- For non-Retina iPhone, iPod Touch, and Android 2.1+ devices: -->
		<link rel="apple-touch-icon-precomposed" href="apple-touch-icon-precomposed.png">

		<!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->
		<link rel="icon" href="/favicon.ico" />

		<link rel='stylesheet' href='/assets/css/72lions.merged.min.css' />

		<link href='http://fonts.googleapis.com/css?family=Oswald' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" type="text/css" media="all and (max-width: 600px)" href="/assets/css/mobile-hires.css" />
		<link rel="stylesheet" type="text/css" media="all and (max-width: 768px)" href="/assets/css/ipad.css" />

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
				<a href="/category/blog" class="logo" title="Blog">
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
				<ul class="clearfix">
					<li><a href="/category/blog" class="nav-blog" title="Blog">Blog</a></li>
					<li><a href="/category/experiments" class="nav-experiments" title="Experiments">Experiments</a></li>
					<li><a href="/category/portfolio" class="nav-portfolio" title="Portfolio">Portfolio</a></li>
					<li><a href="/about" class="nav-about" title="About">About</a></li>
				</ul>
			</nav>
		</header>
		<div id="wrapper">
			<div id="sections-wrapper">
				<div class="preloader"> </div>
				<div class="seo">
					<?php
						echo $seoMarkup;
					?>
				</div>
				<section class="post-details clearfix">
					<a href="#" title="Back" class="back"><span></span></a>
					<div class="centered clearfix">
						<div class="content clearfix">
							<div>
							<h1 class="title"></h1>
							<div>
							<div class="sidebar">
								<h2></h2>
								<time></time>
								<div class="categories"></div>
								<a href="#" class="github-link" target="_blank"><span>Fork it</span></a>
								<a href="#" class="download-link" target="_blank"><span>Download</span></a>
								<a href="#" class="demo-link" target="_blank"><span>Demo</span></a>
								<a href="#" class="website-link" target="_blank"><span>Visit website</span></a>
								<ul class="tags"></ul>
							</div>
							<div class="details">
								<div class="text"></div>
							</div>
							<div class="comments">
									<div id="disqus_thread"></div>
									<script type="text/javascript">
									    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
									    var disqus_shortname = '72lions'; // required: replace example with your forum shortname
									    var disqus_developer = 1;
									    var isDisqusLoaded = false;

									    /**
									     * A function that keeps all the callbacks for the disqus plugin
									     * @author Thodoris Tsiridis
									     */
										function disqus_config() {
											// On ready we are changing the isDisqusLoaded variable to true
											// so that we can check it from anywhere in the code
										    this.callbacks.onReady = [function() {
										        isDisqusLoaded = true;
										    }];
										}

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

				<section class="experiments">
					<div class="centered">

					</div>
				</section>

				<section class="portfolio">
					<div class="centered">
					</div>
				</section>

				<section class="tag">
					<div class="centered">
					</div>
				</section>

			</div>
		</div>
		<footer class="clearfix">
			<aside class="menu">
				<nav>
					<a href="/category/blog" class="nav-blog" title="Blog">Blog</a>
					<a href="/category/experiments" class="nav-experiments" title="Experiments">Experiments</a>
					<a href="/category/portfolio" class="nav-portfolio" title="Portfolio">Portfolio</a>
					<a href="/about" class="nav-about" title="About">About</a>
				</nav>
				<a href="http://www.w3.org/html/logo/" class="html5logo">
					<img src="http://www.w3.org/html/logo/badge/html5-badge-h-solo.png" width="63" height="64" alt="HTML5 Powered" title="HTML5 Powered">
				</a>
			</aside>

			<aside class="footer-logo clearfix">

			</aside>

			<aside class="latest-tweets">
				<article>
					<hgroup><h1>Latest Tweets</h1></hgroup>
				</article>
			</aside>

			<aside class="flickr-photos">
				<hgroup><h1>My photos on Flickr</h1></hgroup>
				<nav>

				</nav>
			</aside>

			<aside class="copy">
				72lions.com is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/" target="_blank">Creative Commons Attribution-NonCommercial 3.0 Unported License</a>.
			</aside>

		</footer>

		<!--<canvas id="background"></canvas>-->

		<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="/assets/js/libs/jquery-1.6.4.min.js"><\/script>')</script>
		<script type="text/javascript" src="/assets/js/libs/jquery.easing.1.3.js"></script>

 		<script src='/assets/js/72lions.merged.min.js'></script>

		<!--[if lt IE 7 ]>
		<script defer src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
		<script defer>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
		<![endif]-->

	</body>
</html>
