<?php

require_once 'lib/Medoo/medoo.php';
require_once 'MuinaismuistotImportSettings.php';

class MuinaismuistotImport {
	protected $settings;
	protected $database;

	public function __construct() {
		$this->settings = new MuinaismuistotImportSettings();
		$this->database = new medoo([
			'database_type' => 'mysql',
			'database_name' => $this->settings->DB_NAME,
			'server' => $this->settings->DB_SERVER,
			'username' => $this->settings->DB_USERNAME,
			'password' => $this->settings->DB_PASSWORD,
			'charset' => $this->settings->DB_CHARSET
		]);
	}

	public function start() {
		echo "Starting import<br>";
		$this->dropAndCreateWorkTable();
		$this->importCSV();
		$this->createAjoituTable();
		$this->insertDataToAjoitus();
		echo "Import finished<br>";
	}

	protected function checkErrorAndDieIfPresent() {
		if($this->database->error()[0] != '0000') {
			echo "Last SQL Query: ".$this->database->last_query()."<br>";
			echo "Error: ";
			var_dump($this->database->error());
			die();
		}
	}

	protected function dropAndCreateWorkTable() {
		$createTableSql = "
			DROP TABLE IF EXISTS `muinaisjaannospisteet_work`;
			CREATE TABLE IF NOT EXISTS `muinaisjaannospisteet_work` (
			  `ID` int(8) NOT NULL AUTO_INCREMENT,
			  `X` decimal(20,12) NOT NULL,
			  `Y` decimal(20,12) NOT NULL,
			  `KUNTA` varchar(256) NOT NULL,
			  `MJTUNNUS` int(8) NOT NULL,
			  `KOHDENIMI` varchar(256) NOT NULL,
			  `AJOITUS` varchar(256) NOT NULL,
			  `TYYPPI` varchar(256) NOT NULL,
			  `ALATYYPPI` varchar(256) NOT NULL,
			  `LAJI` varchar(256) NOT NULL,
			  `I` decimal(20,12) NOT NULL,
  			  `P` decimal(20,12) NOT NULL,
			  `PAIKANNUST` int(5) NOT NULL,
			  `PAIKANNU0` int(1) NOT NULL,
			  `SELITE` text NOT NULL,
			  `TUHOUTUNUT` varchar(5) NOT NULL,
			  `LUONTIPVM` varchar(10) NOT NULL,
			  `MUUTOSPVM` varchar(10) NOT NULL,
			  `ZALA` decimal(20,12) NOT NULL,
			  `ZYLA` decimal(20,12) NOT NULL,
			  `VEDENALAIN` varchar(1) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		echo "Created muinaisjaannospisteet_work table<br>";
	}

	protected function importCSV() {
		echo "Starting import to muinaisjaannospisteet_work table<br>";

		/*
		* When turned on, PHP will examine the data read by fgets() and file() to see if it is using Unix, MS-Dos or Macintosh line-ending conventions. 
		* This enables PHP to interoperate with Macintosh systems, but defaults to Off, as there is a very small performance penalty when detecting the EOL conventions for the first line
		*/
		ini_set("auto_detect_line_endings", true);

		/*
		* Must be greater than the longest line (in characters) to be found in the CSV file (allowing for trailing line-end characters). It became optional in PHP 5. 
		* Omitting this parameter (or setting it to 0 in PHP 5.1.0 and later) the maximum line length is not limited, which is slightly slower. 
		*/
		$length = 0;

		if(!file_exists("muinaisjaannospisteet.csv")) {
			die("Error: muinaisjaannospisteet.csv file does not exist<br>");
		}
		$handle = fopen("muinaisjaannospisteet.csv", "r");
		$rowIndex = 0;
		$separator = ",";
		$errorCode = null;

		while (($data = fgetcsv($handle, $length, $separator)) !== false) {
			$rowIndex++;
			if($rowIndex == 1) {
				//Don't import column header row
				continue;
			}

			$this->database->insert("muinaisjaannospisteet_work", [
				'X' => (double)$data[0],
				'Y' => (double)$data[1],
				'KUNTA' => $data[2],
				'MJTUNNUS' => (int)$data[3],
				'KOHDENIMI' => $data[4],
				'AJOITUS' => $data[5],
				'TYYPPI' => $data[6],
				'ALATYYPPI' => $data[7],
				'LAJI' => $data[8],
				'I' => (double)$data[9],
				'P' => (double)$data[10],
				'PAIKANNUST' => (int)$data[11],
				'PAIKANNU0' => (int)$data[12],
				'SELITE' => $data[13],
				'TUHOUTUNUT' => $data[14],
				'LUONTIPVM' => $data[15],
				'MUUTOSPVM' => $data[16],
				'ZALA' => (double)$data[17],
				'ZYLA' => (double)$data[18],
				'VEDENALAIN' => $data[19]
			]);

			$this->checkErrorAndDieIfPresent();
		}
		echo $rowIndex . " rows imported<br>";
	}

	protected function createAjoituTable() {
		$createTableSql = "
			DROP TABLE IF EXISTS `ajoitus`;
			CREATE TABLE IF NOT EXISTS `ajoitus` (
			  `ID` int(4) NOT NULL AUTO_INCREMENT,
			  `NIMI` varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		echo "Created ajoitus table<br>";
	}

	protected function insertDataToAjoitus() {
		$sql = "
			SELECT DISTINCT AJOITUS
			FROM muinaisjaannospisteet_work
		";
		$data = $this->database->query($sql)->fetchAll();
		$this->checkErrorAndDieIfPresent();

		$distinctAjoitukset = [];

		foreach ($data as $row) {
			//Data example: 'abc, , , ' or 'abc, def, , '
			$rowAjoitukset = array_filter(array_map('trim', explode(",", $row['AJOITUS'])));
			$distinctAjoitukset = array_merge($distinctAjoitukset, $rowAjoitukset);
			$distinctAjoitukset = array_unique($distinctAjoitukset);
		}

		foreach ($distinctAjoitukset as $ajoitus) {
			$this->database->insert("ajoitus", [
				'NIMI' => $ajoitus
			]);
			$this->checkErrorAndDieIfPresent();
		}

		echo "Inserted distinct data to ajoitus table<br>";
	}

}
