seventytwolions.Model.Base = function(){

    var data = {};
    this.name = '';
    this.id = '';

    /**
     * Sets the model data
     * @param {Object} modelData The model data
     * @author Thodoris Tsiridis
     */
    this.setData = function(modelData) {
        data = modelData;
    };

    /**
     * Sets the name of the model
     * @param {String} name The name/type of the model
     * @author Thodoris Tsiridis
     */
    this.setName = function(name) {
        this.name = name;
    };

    /**
     * Sets the id of the model
     * @param {String} id The id of the model
     * @author Thodoris Tsiridis
     */
    this.setId = function (id) {
        this.id = id;
    };

    this.set = function(key, value) {
        data[key] = value;
    };

    this.get = function(key) {
        return data[key];
    };

};

