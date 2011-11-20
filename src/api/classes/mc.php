<?php
class MC {

    /**
     * Constants
     */
    public static $HOST = '127.0.0.1';
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
        self::$memcache = new Memcache();
        self::$memcache->connect(self::$HOST, 11211) or die ("Could not connect");
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

        self::$memcache->get(self::$prefix . self::$group . ':'.md5($key));

    }

    /**
     * Returns an object from memcache
     * @param {String} $key The name of the key that we want to save
     * @param {Object} $value The object that we want to save
     * @author Thodoris Tsiridis
     */
    public static function set($key, $value, $time = 864000) {
        // Check if it is connected
        if(!self::$isConnected){
            // Connect
            self::connect();
            echo 'connected';
        }

        self::$memcache->set(self::$prefix . self::$group . ':' . md5($key), $value, true, $time);
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

}
?>
