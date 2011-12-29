YAHOO.env.classMap = {"STL.View.Blog": "72lions", "STL.ControllerManager": "72lions", "STL.Router": "72lions", "STL.View.Base": "72lions", "STL.Controller.SectionsManager": "72lions", "STL.Model.Base": "72lions", "STL.View.Contact": "72lions", "STL.Controller.Portfolio": "72lions", "STL.Controller.Main": "72lions", "STL.Model.Categories": "72lions", "STL.Controller.Footer": "72lions", "STL.Controller.ThumbnailItem": "72lions", "STL.View.PostDetails": "72lions", "STL.View.SectionsManager": "72lions", "STL.Controller.Navigation": "72lions", "STL.View.About": "72lions", "STL.Model.Posts": "72lions", "STL.Controller.Experiments": "72lions", "STL.View.Main": "72lions", "STL.Controller.About": "72lions", "STL.View.Footer": "72lions", "STL.Model.Footer": "72lions", "STL.Controller.Blog": "72lions", "STL.Controller.Base": "72lions", "STL.Console": "72lions", "STL.Controller.PostDetails": "72lions", "STL.View.Navigation": "72lions", "STL.View.Portfolio": "72lions", "STL.Controller.Contact": "72lions", "STL.Model.Locale": "72lions", "STL.EventTarget": "72lions", "STL.Lookup": "72lions", "STL.View.Experiments": "72lions", "STL.View.ThumbnailItem": "72lions"};

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
