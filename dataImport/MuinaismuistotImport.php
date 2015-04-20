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
		$this->printMessage("Starting import");

		$this->dropAndCreateMuinaismuistopisteWorkTable();
		$this->importCSVToMuinaismuistopisteWork();

		//Ajoitus
		$this->createAjoituTable();
		$this->insertDataToAjoitus();
		$this->createMuinaisjaannospisteAjoitusTable();
		$this->insertDataToMuinaisjaannospisteAjoitus();

		//Tyyppi
		$this->createAndPopoulateTyyppiTable();
		$this->updateTyyppiToID();

		//Alatyyppi
		$this->createAndPopoulateAlatyyppiTable();
		$this->updateAlatyyppiToID();

		//Laji
		$this->createAndPopoulateLajiTable();
		$this->updateLajiToID();

		//Kunta
		$this->createAndPopoulateKuntaTable();
		$this->updateKuntaToID();

		//Tuhoutunut and vedenalainen
		$this->updateTuhoutunutToBoolean();
		$this->updateVedenalainenToBoolean();

		$this->printMessage("Import finished");
	}

	protected function printMessage($message) {
		echo $message."<br>";
		flush();
	}

	protected function checkErrorAndDieIfPresent() {
		if($this->database->error()[0] != '0000') {
			$this->printMessage("Last SQL Query: ".$this->database->last_query());
			$this->printMessage("Error: ");
			var_dump($this->database->error());
			die();
		}
	}

	protected function dropAndCreateMuinaismuistopisteWorkTable() {
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
			  `LUONTIPVM` date,
			  `MUUTOSPVM` date,
			  `ZALA` decimal(20,12) NOT NULL,
			  `ZYLA` decimal(20,12) NOT NULL,
			  `VEDENALAIN` varchar(1) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		$this->printMessage("Created muinaisjaannospisteet_work table");
	}

	protected function dropAndCreateMuinaismuistopisteFinalTable() {
		$createTableSql = "
			DROP TABLE IF EXISTS `muinaisjaannospisteet_work`;
			CREATE TABLE IF NOT EXISTS `muinaisjaannospisteet_work` (
			  `ID` int(8) NOT NULL AUTO_INCREMENT,
			  `X` decimal(20,12) NOT NULL,
			  `Y` decimal(20,12) NOT NULL,
			  `KUNTA` int(3) NOT NULL,
			  `MJTUNNUS` int(8) NOT NULL,
			  `KOHDENIMI` varchar(256) NOT NULL,
			  `AJOITUS` int(3) NOT NULL,
			  `TYYPPI` int(3) NOT NULL,
			  `ALATYYPPI` int(3) NOT NULL,
			  `LAJI` int(3) NOT NULL,
			  `PAIKANNUST` int(5) NOT NULL,
			  `PAIKANNU0` int(1) NOT NULL,
			  `SELITE` text NOT NULL,
			  `TUHOUTUNUT` tinyint(1) NOT NULL,
			  `LUONTIPVM` date,
			  `MUUTOSPVM` date,
			  `ZALA` decimal(20,12) NOT NULL,
			  `ZYLA` decimal(20,12) NOT NULL,
			  `VEDENALAIN` tinyint(1) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		$this->printMessage("Created muinaisjaannospisteet_work table");
	}

	protected function importCSVToMuinaismuistopisteWork() {
		$this->printMessage("Starting import to muinaisjaannospisteet_work table");

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
				'LUONTIPVM' => $this->parseDateToMySql($data[15]),
				'MUUTOSPVM' => $this->parseDateToMySql($data[16]),
				'ZALA' => (double)$data[17],
				'ZYLA' => (double)$data[18],
				'VEDENALAIN' => $data[19]
			]);

			$this->checkErrorAndDieIfPresent();

			if($rowIndex % 5000 == 0) {
				$this->printMessage($rowIndex . " rows imported");
			}
		}

		fclose($handle);
		$this->printMessage($rowIndex . " rows imported");
	}

	protected function parseDateToMySql($dateString) {
		$date = date_create_from_format('Y/m/d', $dateString);
		if($date === false) {
			return null;
		}
		return $date->format('Y-m-d');
	}

	protected function createAjoituTable() {
		$createTableSql = "
			DROP TABLE IF EXISTS `ajoitus`;
			CREATE TABLE IF NOT EXISTS `ajoitus` (
			  `ID` int(2) NOT NULL AUTO_INCREMENT,
			  `NIMI` varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		$this->printMessage("Created ajoitus table");
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
			$rowAjoitukset = $this->parseAjoituksetStringToArray($row['AJOITUS']);
			$distinctAjoitukset = array_merge($distinctAjoitukset, $rowAjoitukset);
			$distinctAjoitukset = array_unique($distinctAjoitukset);
		}

		foreach ($distinctAjoitukset as $ajoitus) {
			$this->database->insert("ajoitus", [
				'NIMI' => $ajoitus
			]);
			$this->checkErrorAndDieIfPresent();
		}

		$this->printMessage("Inserted distinct data to ajoitus table");
	}

	protected function parseAjoituksetStringToArray($str) {
		//Data example: 'abc, , , ' or 'abc, def, , '
		return array_filter(array_map('trim', explode(",", $str)));
	}

	protected function createMuinaisjaannospisteAjoitusTable() {
		$createTableSql = "
			DROP TABLE IF EXISTS `muinaisjaannospiste_ajoitus`;
			CREATE TABLE IF NOT EXISTS `muinaisjaannospiste_ajoitus` (
			  `MUINAISJAANNOSPISTE_ID` int(8) NOT NULL,
			  `AJOITUS_ID` int(4) NOT NULL,
			  PRIMARY KEY (MUINAISJAANNOSPISTE_ID, AJOITUS_ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		$this->printMessage("Created muinaisjaannospiste_ajoitus table");
	}

	protected function getAjoituksetIdByNameMap() {
		$sql = "
			SELECT ID, NIMI
			FROM ajoitus
		";
		$ajoitukset = $this->database->query($sql)->fetchAll();
		$this->checkErrorAndDieIfPresent();
		$map = [];

		foreach ($ajoitukset as $ajoitus) {
			$map[$ajoitus['NIMI']] = $ajoitus['ID'];
		}
		return $map;
	}

	protected function insertDataToMuinaisjaannospisteAjoitus() {
		$ajoitusIdByNameMap = $this->getAjoituksetIdByNameMap();

		$sql = "
			SELECT ID, AJOITUS
			FROM muinaisjaannospisteet_work
		";
		$data = $this->database->query($sql)->fetchAll();
		$this->checkErrorAndDieIfPresent();

		foreach ($data as $row) {
			//Data example: 'abc, , , ' or 'abc, def, , '
			$rowAjoitukset = $this->parseAjoituksetStringToArray($row['AJOITUS']);
			foreach ($rowAjoitukset as $rowAjoitus) {
				$this->database->insert("muinaisjaannospiste_ajoitus", [
					'MUINAISJAANNOSPISTE_ID' => $row['ID'],
					'AJOITUS_ID' => $ajoitusIdByNameMap[$rowAjoitus]
				]);
			}
		}

		$this->printMessage("Inserted link data to muinaisjaannospiste_ajoitus table");
	}

	protected function createAndPopoulateTyyppiTable() {
		$createTableSql = "
			DROP TABLE IF EXISTS `tyyppi`;
			CREATE TABLE IF NOT EXISTS `tyyppi` (
			  `ID` int(2) NOT NULL AUTO_INCREMENT,
			  `NIMI` varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		$sql = "
			INSERT INTO tyyppi(NIMI)
			SELECT DISTINCT TYYPPI
			FROM muinaisjaannospisteet_work
		";
		$this->database->query($sql);
		$this->checkErrorAndDieIfPresent();

		$this->printMessage("Created and populated tyyppi table");
	}

	protected function updateTyyppiToID() {
		$sql = "
			SELECT ID, NIMI
			FROM tyyppi
		";
		$tyypit = $this->database->query($sql)->fetchAll();
		$this->checkErrorAndDieIfPresent();

		foreach ($tyypit as $tyyppi) {
			$this->database->update("muinaisjaannospisteet_work", [
				"TYYPPI" => $tyyppi["ID"]
			], [
				"TYYPPI" => $tyyppi["NIMI"]
			]);
		}

		$this->printMessage("Replaced tyyppi name with id");
	}

	protected function createAndPopoulateAlatyyppiTable() {
		$createTableSql = "
			DROP TABLE IF EXISTS `alatyyppi`;
			CREATE TABLE IF NOT EXISTS `alatyyppi` (
			  `ID` int(2) NOT NULL AUTO_INCREMENT,
			  `NIMI` varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		$sql = "
			INSERT INTO alatyyppi(NIMI)
			SELECT DISTINCT ALATYYPPI
			FROM muinaisjaannospisteet_work
		";
		$this->database->query($sql);
		$this->checkErrorAndDieIfPresent();

		$this->printMessage("Created and populated alatyyppi table");
	}

	protected function updateAlatyyppiToID() {
		$sql = "
			SELECT ID, NIMI
			FROM alatyyppi
		";
		$rows = $this->database->query($sql)->fetchAll();
		$this->checkErrorAndDieIfPresent();

		foreach ($rows as $row) {
			$this->database->update("muinaisjaannospisteet_work", [
				"ALATYYPPI" => $row["ID"]
			], [
				"ALATYYPPI" => $row["NIMI"]
			]);
		}

		$this->printMessage("Replaced alatyyppi name with id");
	}

	protected function createAndPopoulateLajiTable() {
		$createTableSql = "
			DROP TABLE IF EXISTS `laji`;
			CREATE TABLE IF NOT EXISTS `laji` (
			  `ID` int(2) NOT NULL AUTO_INCREMENT,
			  `NIMI` varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		$sql = "
			INSERT INTO laji(NIMI)
			SELECT DISTINCT LAJI
			FROM muinaisjaannospisteet_work
		";
		$this->database->query($sql);
		$this->checkErrorAndDieIfPresent();

		$this->printMessage("Created and populated laji table");
	}

	protected function updateLajiToID() {
		$sql = "
			SELECT ID, NIMI
			FROM laji
		";
		$rows = $this->database->query($sql)->fetchAll();
		$this->checkErrorAndDieIfPresent();

		foreach ($rows as $row) {
			$this->database->update("muinaisjaannospisteet_work", [
				"LAJI" => $row["ID"]
			], [
				"LAJI" => $row["NIMI"]
			]);
		}

		$this->printMessage("Replaced laji name with id");
	}

	protected function createAndPopoulateKuntaTable() {
		$createTableSql = "
			DROP TABLE IF EXISTS `kunta`;
			CREATE TABLE IF NOT EXISTS `kunta` (
			  `ID` int(2) NOT NULL AUTO_INCREMENT,
			  `NIMI` varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=MyISAM DEFAULT CHARSET=utf8;
		";
		$this->database->query($createTableSql);
		$this->checkErrorAndDieIfPresent();

		$sql = "
			INSERT INTO kunta(NIMI)
			SELECT DISTINCT KUNTA
			FROM muinaisjaannospisteet_work
		";
		$this->database->query($sql);
		$this->checkErrorAndDieIfPresent();

		$this->printMessage("Created and populated kunta table");
	}

	protected function updateKuntaToID() {
		$sql = "
			SELECT ID, NIMI
			FROM kunta
		";
		$rows = $this->database->query($sql)->fetchAll();
		$this->checkErrorAndDieIfPresent();

		foreach ($rows as $row) {
			$this->database->update("muinaisjaannospisteet_work", [
				"KUNTA" => $row["ID"]
			], [
				"KUNTA" => $row["NIMI"]
			]);
		}

		$this->printMessage("Replaced kunta name with id");
	}

	protected function updateTuhoutunutToBoolean() {
		$this->database->update("muinaisjaannospisteet_work", [
			"TUHOUTUNUT" => 1
		], [
			"TUHOUTUNUT" => "Kyllä"
		]);

		$this->database->update("muinaisjaannospisteet_work", [
			"TUHOUTUNUT" => 0
		], [
			"TUHOUTUNUT" => "Ei"
		]);

		$this->printMessage("Replaced tuhoutunut name with boolean");
	}

	protected function updateVedenalainenToBoolean() {
		$this->database->update("muinaisjaannospisteet_work", [
			"VEDENALAIN" => 1
		], [
			"VEDENALAIN" => "k"
		]);

		$this->database->update("muinaisjaannospisteet_work", [
			"VEDENALAIN" => 0
		], [
			"VEDENALAIN" => "e"
		]);

		$this->printMessage("Replaced vedenalainen name with boolean");
	}

}
