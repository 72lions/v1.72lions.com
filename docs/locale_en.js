/**
 * Locale Model
 *
 * @module 72lions
 * @class Locale
 * @namespace STL.Model
 * @extends STL.Model.Base
 * @author Thodoris Tsiridis
 * @version 1.0
 */
STL.Model.Locale = function(global){

    /**
     * An array of all the months
     *
     * @private
     * @type Array
     * @default ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
     */
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    /**
     * An array of all the week days
     *
     * @private
     * @type Array
     * @default ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
     */
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    /**
     * The page title
     *
     * @private
     * @type String
     * @default "72Lions - The playground of developer Thodoris Tsiridis"
     */
    var pageTitle = "72Lions - The playground of developer Thodoris Tsiridis";

    /**
     * Returns the name of the month
     *
     * @param  {Number} monthIndex The month index
     * @return {String}
     */
    this.getMonthName = function(monthIndex){
        return months[monthIndex];
    };

    /**
     * Returns the name of a day of the week
     *
     * @param  {Number} dayIndex The day of the week index
     * @return {String}
     */
    this.getDayName = function(dayIndex){
        return days[dayIndex];
    };

    /**
     * Returns the title of the page
     *
     * @return {String}
     */
    this.getPageTitle = function (){
        return pageTitle;
    };

    return this;

}(window);
