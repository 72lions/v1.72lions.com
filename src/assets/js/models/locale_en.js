seventytwolions.Model.locale = function(){

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var pageTitle = "72Lions - The playground of developer Thodoris Tsiridis";
    /**
     * Returns the name of the month
     * @param  {Number} monthIndex The month index
     * @return {String}
     */
    this.getMonthName = function(monthIndex){
        return months[monthIndex];
    };

    /**
     * Returns the name of a day of the week
     * @param  {Number} dayIndex The day of the week index
     * @return {String}
     */
    this.getDayName = function(dayIndex){
        return days[dayIndex];
    };

    /**
     * Returns the title of the page
     * @return {String}
     */
    this.getPageTitle = function (){
        return pageTitle;
    };

};

seventytwolions.Model.Locale = new seventytwolions.Model.locale();
