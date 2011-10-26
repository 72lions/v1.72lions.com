/**
 * Index Controller
 *
 * @author Thodoris Tsiridis
 * @version 1.0
 */
seventytwolions.Controller.Navigation = function() {

    var me = this;

    this.postInitialize = function(){
        Router.registerForEvent('pop', onPopPushEvent);
        Router.registerForEvent('push', onPopPushEvent);
    }

    var onPopPushEvent = function(state){

        if(state.pathSegments === undefined){
            me.getView().selectNavigationItem('');
        } else {
            me.getView().selectNavigationItem(state.pathSegments[0]);
        }

    }
}

seventytwolions.Controller.Navigation.prototype = new seventytwolions.Controller.Base();