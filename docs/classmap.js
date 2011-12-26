YAHOO.env.classMap = {"seventytwolions.Controller.Experiments": "72lions", "seventytwolions.Controller.Main": "72lions", "seventytwolions.Controller.Navigation": "72lions", "seventytwolions.ControllerManager": "72lions", "seventytwolions.Controller.Portfolio": "72lions", "seventytwolions.Controller.SectionsManager": "72lions", "seventytwolions.View.PostDetails": "72lions", "seventytwolions.View.Main": "72lions", "seventytwolions.Controller.PostDetails": "72lions", "seventytwolions.Controller.Contact": "72lions", "seventytwolions.Controller.Footer": "72lions", "seventytwolions.Console": "72lions", "seventytwolions.Controller.About": "72lions", "seventytwolions.Lookup": "72lions", "seventytwolions.View.ThumbnailItem": "72lions", "seventytwolions.View.SectionsManager": "72lions", "seventytwolions.Router": "72lions", "seventytwolions.Controller.Base": "72lions", "seventytwolions.View.Portfolio": "72lions", "seventytwolions.EventTarget": "72lions", "seventytwolions.Controller.ThumbnailItem": "72lions", "seventytwolions.View.Navigation": "72lions", "seventytwolions.Controller.Blog": "72lions"};

YAHOO.env.resolveClass = function(className) {
    var a=className.split('.'), ns=YAHOO.env.classMap;

    for (var i=0; i<a.length; i=i+1) {
        if (ns[a[i]]) {
            ns = ns[a[i]];
        } else {
            return null;
        }
    }

    return ns;
};
