<?php
/**
 * The memcached class is responsible for connecting, getting/setting values and disconnecting from memcached
 *
 * @module 72lionsPHP
 * @class MC
 * @author Thodoris Tsiridis
 * @version 1.0
 */
class MC {

    /**
     * Constants
     */
    protected static $HOST = 'localhost';
    protected static $PORT = 11211;
    public static $isConnected = false;
    protected static $memcache;
    protected static $prefix = '72lions';
    protected static $group = 'default';

    /**
     * Connects to memcache
     * @author Thodoris Tsiridis
     */
    public static function connect() {
         // Connect to memecache
        self::$memcache = new Memcache;
        self::$memcache->connect(self::$HOST, self::$PORT) or die ("Could not connect");
        self::$isConnected = true;
    }

    /**
     * Returns an object from memcache
     * @param {String} $key The name of the key that we want to get
     * @return {Object} The object that we want
     * @author Thodoris Tsiridis
     */
    public static function get($key) {

        // Check if it is connected
        if(!self::$isConnected){
            // Connect
            self::connect();
        }

        return self::$memcache->get(self::$prefix . self::$group . ':'.md5($key));

    }

    /**
     * Returns an object from memcache
     * @param {String} $key The name of the key that we want to save
     * @param {Object} $value The object that we want to save
     * @param {Number} $time The time that the object will stay in memory
     * @author Thodoris Tsiridis
     */
    public static function set($key, $value, $time = 864000) {

        // Check if it is connected
        if(!self::$isConnected){
            // Connect
            self::connect();
        }

        self::$memcache->set(self::$prefix . self::$group . ':' . md5($key), $value, false, $time);
    }

    /**
     * Clears memcache
     * @author Thodoris Tsiridis
     */
    public static function flush() {
        // Check if it is connected
        if(!self::$isConnected){
            // Connect
            self::connect();
        }

        self::$memcache->flush();

    }

    /**
     * Closes memcache connection
     * @author Thodoris Tsiridis
     */
    public static function close() {
        // Check if it is connected
        if(self::$isConnected){
            self::$memcache->close();
            self::$isConnected = false;
        }



    }

}
?>
