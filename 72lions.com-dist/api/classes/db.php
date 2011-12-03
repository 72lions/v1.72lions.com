<?php
	class DB{

		public $conn;
		public $username;
		public $password;
		public $host;
		public $db;

		/**
		 * Connects to the database
		 *
		 * @param {String} $username The username that will be used for connecting to the database
		 * @param {String} $password The password that will be used for connecting to the database
		 * @param {String} $host The database host
		 * @param {String} $db The database name
		 */
		public function connect( $username, $password, $host, $db){

			error_reporting(E_ALL ^ E_NOTICE);

			$this->username = $username;
			$this->password = $password;
			$this->host = $host;
			$this->db = $db;

			//Connecting, selecting database
			$this->conn = mysql_connect($this->host, $this->username, $this->password) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
			mysql_select_db($this->db) or die('Class '.__CLASS__.' -> '.__FUNCTION__.' : ' . mysql_error());
			mysql_query("set names 'utf8'");
            return $this->conn;

		}

		public function disconnect(){
			mysql_close($this->conn);
		}


	}
?>
