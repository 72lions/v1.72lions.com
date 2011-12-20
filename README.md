 ________    ___    __  
/\_____  \ /'___`\ /\ \       __  
\/___//'/'/\_\ /\ \\ \ \     /\_\    ___     ___     ____  
    /' /' \/_/// /__\ \ \  __\/\ \  / __`\ /' _ `\  /',__\  
  /' /'      // /_\ \\ \ \L\ \\ \ \/\ \L\ \/\ \/\ \/\__, `\  
 /\_/       /\______/ \ \____/ \ \_\ \____/\ \_\ \_\/\____/  
 \//        \/_____/   \/___/   \/_/\/___/  \/_/\/_/\/___/  


This is the entire source code for 72lions.com. Along with the source code there is a build folder that uses ant for building the website.  

## Important
The app is only tested in modern browsers like Chrome, Firefox, Safari, iPhone 3/4/4s and iPad Mobile Safari.  
Although I have added support for IE it is not tested in that browser.  
The reason for doing this is because I don't want to waste my time in order to support a crappy browser like IE when most of the people that will be interested in reading my website won't user IE in any case.  

## Dependencies
1. jQuery 1.6.4 http://jquery.com/ (included in the src)
2. Modernizr 2.0.6 http://www.modernizr.com/ (included in the src)
3. jQuery Easing 1.3 http://gsgd.co.uk/sandbox/jquery/easing/ (included in the src)
4. EventTarget https://github.com/mrdoob/eventtarget.js/ (included in the src)
5. Router https://github.com/72lions/Router (included in the src)
6. Memcached PHP http://memcached.org/ (NOT included. You need to install it)
   For Windows check http://pureform.wordpress.com/2008/01/10/installing-memcache-on-windows-for-php/)
   For OSX check http://www.lecloud.net/post/3102678831/install-memcached-php-memcached-extension-under-mac
   For Linux distributions check http://amiworks.co.in/talk/step-by-step-guide-to-install-memcache-on-linux/
   These are just examples of how to install memcached on the most popular OS, so it might be the case that won't work on everybody. You can search on Google on how to setup memcached if you need more help.
7. PHP http://php.net
8. Apache with mod_rewrite enabled http://www.apache.org/
9. MySQL http://www.mysql.com/
10.Wordpress 3.2+ http://wordpress.org/
11.Ant http://ant.apache.org/ (for building the entire website)

## Config
1. MySQL connection  
   Go to src/api/classes/api.php and modified the following variables  

   // The mysql db username    
   protected static $DB_USERNAME = '';  
   // The mysql db password  
   protected static $DB_PASSWORD = '';  
   // The mysql db host  
   protected static $DB_HOST = '';  
   // The mysql db name  
   protected static $DB_NAME = '';  

2. Memcached connection  
   Go to src/api/classes/mc.php and modified the following variables  

   // The memcached server host   
   protected static $HOST = 'localhost';  
   // The memcached server port   
   protected static $PORT = 11211;  
   // The memcached keys prefix. e.x. 72lions.com   
   protected static $prefix = '';  
   // The memcached server group e.x. main-website   
   protected static $group = '';  

3. Apache  
   Make sure that you set the src folder as the root on Apache.  
   If you don't want the app to be on the root then you have to modify the Router basePath (read the documentation) and the path for the CSS/JS and image files.  

### That's it! You are all set!

## Build  
1. Go into the build folder  
2. Run ant (make sure that you have properly installed ant on your computer)  

