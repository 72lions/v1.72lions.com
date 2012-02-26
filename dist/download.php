<?php
  $file = $_REQUEST['file'];
?>
<html>
  <head>
      <title>Starting download...</title>
      <link href='http://fonts.googleapis.com/css?family=Oswald' rel='stylesheet' type='text/css'>
      <style type="text/css">

        html, body {
          -webkit-font-smoothing: antialiased;
          background-color:#ebebeb;
        }

        #container {
          width:300px;
          position:absolute;
          left:50%;
          top:50%;
          margin:-100px 0px 0px -150px;
          background-color:#fff;
          color:#666;
          padding:20px 10px 20px 10px;

          -webkit-border-radius:4px;
          -moz-border-radius:4px;
          -o-border-radius:4px;
          border-radius:4px;

          -webkit-box-shadow:0px 1px 1px rgba(0, 0, 0, 0.3);
          -moz-box-shadow:0px 1px 1px rgba(0, 0, 0, 0.3);
          -o-box-shadow:0px 1px 1px rgba(0, 0, 0, 0.3);
          box-shadow:0px 1px 1px rgba(0, 0, 0, 0.3);

          line-height:40px;
          text-align:center;
          font-size:24px;
          font-weight:bold;
          font-family:Arial;

        }

        #container img {
          float:left;
          margin-left:7px;
          -webkit-border-radius:4px;
          -moz-border-radius:4px;
          -o-border-radius:4px;
          border-radius:4px;
        }
      </style>
        <script language="javascript">
          function gotourl(){
            location.href = "http://experiments.72lions.com/<?php echo $file;?>";
           }

           setTimeout("gotourl()",2000);
        </script>
    </head>
    <body>
      <div id="container" style="">
        <img src="/apple-touch-icon-precomposed.png" width="40" height="40" alt="72lions logo" />Starting download...
        </div>
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
    </body>
</html>
