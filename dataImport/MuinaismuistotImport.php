<?php

require_once 'MuinaismuistotImportSettings.php';

class MuinaismuistotImport {
	protected $settings;
	protected $pdo;

	public function __construct() {
		$this->settings = new MuinaismuistotImportSettings();
		$this->initDatabase();
	}

	protected function initDatabase() {
		$this->pdo = new PDO(
			'mysql:host=' . $this->settings->DB_SERVER . ';dbname=' . $this->settings->DB_NAME,
			$this->settings->DB_USERNAME,
			$this->settings->DB_PASSWORD
		);
		$this->pdo->exec('SET SQL_MODE=ANSI_QUOTES');
		$this->pdo->exec("SET NAMES '" . $this->settings->DB_CHARSET . "'");
		$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}

	public function start($step) {
		switch ($step) {
		    case 1:
		        //Create temp work table
		    	$this->dropOldTables();
				$this->dropAndCreateMuinaismuistopisteWorkTable();
				$this->printMessage('Next: Import data from CSV');
		        break;
		    case 2:
		        //Import data from CSV
				$this->importCSVToMuinaismuistopisteWork();
				$this->printMessage('Next: Tyyppi');
		        break;
		    case 3:
		        //Tyyppi
				$this->createAndPopoulateTyyppiTable();
				$this->updateTyyppiToID();
				$this->printMessage('Next: Alatyyppi');
		        break;
		    case 4:
		        //Alatyyppi
				$this->createAndPopoulateAlatyyppiTable();
				$this->updateAlatyyppiToID();
				$this->printMessage('Next: Laji');
		        break;
		    case 5:
		        //Laji
				$this->createAndPopoulateLajiTable();
				$this->updateLajiToID();
				$this->printMessage('Next: Kunta');
		        break;
		    case 6:
		        //Kunta
				$this->createAndPopoulateKuntaTable();
				$this->updateKuntaToID();
				$this->printMessage('Next: Tuhoutunut ja Vedenalainen');
		        break;
		    case 7:
		        //Tuhoutunut and vedenalainen
				$this->updateTuhoutunutToBoolean();
				$this->updateVedenalainenToBoolean();
				$this->printMessage('Next: Create final table');
		        break;
		    case 8:
		        //Create final table
				$this->dropAndCreateMuinaismuistopisteFinalTable();
				$this->printMessage('Next: Copy data from work table to final');
		        break;
		    case 9:
		        //Final result
				$this->copyMuinaismuistopisteFromWorkToFinal();
				$this->printMessage('Next: Ajoitus');
		    case 10:
		        //Ajoitus
				$this->createAjoituTable();
				$this->insertDataToAjoitus();
				$this->createMuinaisjaannospisteAjoitusTable();
				$this->insertDataToMuinaisjaannospisteAjoitus();
				$this->printMessage('Next: Create indexes to MUINAISJAANNOSPISTE');
		        break;
		    case 11:
		    	//Create indexes to final table
		    	$this->createIndexesToFinalTable();
		    	$this->printMessage('Next: Drop work table');
		    	break;
		    case 12:
		    	//Drop work table
				$this->dropMuinaismuistopisteWorkTable();
		        break;
		    default:
       			echo "IMPORT_DONE";
		}
		
	}

	protected function printMessage($message) {
		echo '<li>'.$message.'</li>';
	}

	protected function dropOldTables() {
		$sql = "
			DROP TABLE IF EXISTS muinaisjaannospisteet_work;
			DROP TABLE IF EXISTS MUINAISJAANNOSPISTE_AJOITUS;
			DROP TABLE IF EXISTS AJOITUS;
			DROP TABLE IF EXISTS MUINAISJAANNOSPISTE;
			DROP TABLE IF EXISTS TYYPPI;
			DROP TABLE IF EXISTS ALATYYPPI;
			DROP TABLE IF EXISTS LAJI;
			DROP TABLE IF EXISTS KUNTA;
		";
		$this->pdo->query($sql);

		$this->printMessage("Dropped old tables");
	}

	protected function dropAndCreateMuinaismuistopisteWorkTable() {
		$createTableSql = "
			CREATE TABLE IF NOT EXISTS muinaisjaannospisteet_work (
			  ID int(8) NOT NULL AUTO_INCREMENT,
			  X decimal(20,12) NOT NULL,
			  Y decimal(20,12) NOT NULL,
			  KUNTA varchar(256) NOT NULL,
			  MJTUNNUS int(8) NOT NULL,
			  KOHDENIMI varchar(256) NOT NULL,
			  AJOITUS varchar(256) NOT NULL,
			  TYYPPI varchar(256) NOT NULL,
			  ALATYYPPI varchar(256) NOT NULL,
			  LAJI varchar(256) NOT NULL,
			  I decimal(20,12) NOT NULL,
  			  P decimal(20,12) NOT NULL,
			  PAIKANNUST int(5) NOT NULL,
			  PAIKANNU0 int(1) NOT NULL,
			  SELITE text NOT NULL,
			  TUHOUTUNUT varchar(5) NOT NULL,
			  LUONTIPVM date,
			  MUUTOSPVM date,
			  ZALA decimal(20,12) NOT NULL,
			  ZYLA decimal(20,12) NOT NULL,
			  VEDENALAIN varchar(1) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($createTableSql);

		$this->printMessage("Created muinaisjaannospisteet_work table");
	}

	protected function dropMuinaismuistopisteWorkTable() {
		$sql = "
			DROP TABLE IF EXISTS muinaisjaannospisteet_work;
		";
		$this->pdo->query($sql);

		$this->printMessage("Dropped muinaisjaannospisteet_work table");
	}

	protected function dropAndCreateMuinaismuistopisteFinalTable() {
		$createTableSql = "
			CREATE TABLE IF NOT EXISTS MUINAISJAANNOSPISTE (
			  ID int(8) NOT NULL AUTO_INCREMENT,
			  X decimal(20,12) NOT NULL,
			  Y decimal(20,12) NOT NULL,
			  KUNTA int(3) NOT NULL,
			  MJTUNNUS int(8) NOT NULL,
			  KOHDENIMI varchar(256) NOT NULL,
			  AJOITUS int(3) NOT NULL,
			  TYYPPI int(3) NOT NULL,
			  ALATYYPPI int(3) NOT NULL,
			  LAJI int(3) NOT NULL,
			  PAIKANNUST int(5) NOT NULL,
			  PAIKANNU0 int(1) NOT NULL,
			  SELITE text NOT NULL,
			  TUHOUTUNUT tinyint(1) NOT NULL,
			  LUONTIPVM date,
			  MUUTOSPVM date,
			  ZALA decimal(20,12) NOT NULL,
			  ZYLA decimal(20,12) NOT NULL,
			  VEDENALAIN tinyint(1) NOT NULL,
			  PRIMARY KEY (ID),
			  CONSTRAINT fk_KUNTA FOREIGN KEY (KUNTA) REFERENCES KUNTA(ID),
			  CONSTRAINT fk_TYYPPI FOREIGN KEY (TYYPPI) REFERENCES TYYPPI(ID),
			  CONSTRAINT fk_ALATYYPPI FOREIGN KEY (ALATYYPPI) REFERENCES ALATYYPPI(ID),
			  CONSTRAINT fk_LAJI FOREIGN KEY (LAJI) REFERENCES LAJI(ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($createTableSql);

		$this->printMessage("Created final MUINAISJAANNOSPISTE table");
	}

	protected function copyMuinaismuistopisteFromWorkToFinal() {
		$sql = "
			INSERT INTO MUINAISJAANNOSPISTE(X,Y,KUNTA,MJTUNNUS,KOHDENIMI,TYYPPI,ALATYYPPI,LAJI,PAIKANNUST,PAIKANNU0,SELITE,TUHOUTUNUT,LUONTIPVM,MUUTOSPVM,ZALA,ZYLA,VEDENALAIN)
			SELECT X,Y,KUNTA,MJTUNNUS,KOHDENIMI,TYYPPI,ALATYYPPI,LAJI,PAIKANNUST,PAIKANNU0,SELITE,TUHOUTUNUT,LUONTIPVM,MUUTOSPVM,ZALA,ZYLA,VEDENALAIN
			FROM muinaisjaannospisteet_work
		";
		$this->pdo->query($sql);

		$this->printMessage("Copied muinaisjaannospiste data from work to final");
	}

	protected function createIndexesToFinalTable() {
		$sql = "
			CREATE INDEX id_XY ON MUINAISJAANNOSPISTE (X, Y);
			CREATE INDEX id_KUNTA ON MUINAISJAANNOSPISTE (KUNTA);
			CREATE INDEX id_MJTUNNUS ON MUINAISJAANNOSPISTE (MJTUNNUS);
			CREATE INDEX id_TYYPPI ON MUINAISJAANNOSPISTE (TYYPPI);
			CREATE INDEX id_ALATYYPPI ON MUINAISJAANNOSPISTE (ALATYYPPI);
			CREATE INDEX id_LAJI ON MUINAISJAANNOSPISTE (LAJI);
		";
		$this->pdo->query($sql);

		$this->printMessage("Created indexes to MUINAISJAANNOSPISTE");
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

		$sql = "
			INSERT INTO muinaisjaannospisteet_work(X,Y,KUNTA,MJTUNNUS,KOHDENIMI,AJOITUS,TYYPPI,ALATYYPPI,LAJI,I,P,PAIKANNUST,PAIKANNU0,SELITE,TUHOUTUNUT,LUONTIPVM,MUUTOSPVM,ZALA,ZYLA,VEDENALAIN)
			VALUES (:X,:Y,:KUNTA,:MJTUNNUS,:KOHDENIMI,:AJOITUS,:TYYPPI,:ALATYYPPI,:LAJI,:I,:P,:PAIKANNUST,:PAIKANNU0,:SELITE,:TUHOUTUNUT,:LUONTIPVM,:MUUTOSPVM,:ZALA,:ZYLA,:VEDENALAIN)
		";
		$stmt = $this->pdo->prepare($sql);

		while (($data = fgetcsv($handle, $length, $separator)) !== false) {
			$rowIndex++;
			if($rowIndex == 1) {
				//Don't import column header row
				continue;
			}

			$stmt->execute([
				':X' => (double)$data[0],
				':Y' => (double)$data[1],
				':KUNTA' => $data[2],
				':MJTUNNUS' => (int)$data[3],
				':KOHDENIMI' => $data[4],
				':AJOITUS' => $data[5],
				':TYYPPI' => $data[6],
				':ALATYYPPI' => $data[7],
				':LAJI' => $data[8],
				':I' => (double)$data[9],
				':P' => (double)$data[10],
				':PAIKANNUST' => (int)$data[11],
				':PAIKANNU0' => (int)$data[12],
				':SELITE' => $data[13],
				':TUHOUTUNUT' => $data[14],
				':LUONTIPVM' => $this->parseDateToMySql($data[15]),
				':MUUTOSPVM' => $this->parseDateToMySql($data[16]),
				':ZALA' => (double)$data[17],
				':ZYLA' => (double)$data[18],
				':VEDENALAIN' => $data[19]
			]);
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
			CREATE TABLE IF NOT EXISTS AJOITUS (
			  ID int(2) NOT NULL AUTO_INCREMENT,
			  NIMI varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($createTableSql);

		$this->printMessage("Created ajoitus table");
	}

	protected function insertDataToAjoitus() {
		$sql = "
			SELECT DISTINCT AJOITUS
			FROM muinaisjaannospisteet_work
		";
		$data = $this->pdo->query($sql)->fetchAll();

		$distinctAjoitukset = [];

		foreach ($data as $row) {
			//Data example: 'abc, , , ' or 'abc, def, , '
			$rowAjoitukset = $this->parseAjoituksetStringToArray($row['AJOITUS']);
			$distinctAjoitukset = array_merge($distinctAjoitukset, $rowAjoitukset);
			$distinctAjoitukset = array_unique($distinctAjoitukset);
		}

		$sql = "
			INSERT INTO AJOITUS (NIMI)
			VALUES (:NIMI)
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($distinctAjoitukset as $ajoitus) {
			$stmt->execute([
				':NIMI' => $ajoitus
			]);
		}

		$this->printMessage("Inserted distinct data to AJOITUS table");
	}

	protected function parseAjoituksetStringToArray($str) {
		//Data example: 'abc, , , ' or 'abc, def, , '
		return array_filter(array_map('trim', explode(",", $str)));
	}

	protected function createMuinaisjaannospisteAjoitusTable() {
		$createTableSql = "
			CREATE TABLE IF NOT EXISTS MUINAISJAANNOSPISTE_AJOITUS (
			  MUINAISJAANNOSPISTE_ID int(8) NOT NULL,
			  AJOITUS_ID int(4) NOT NULL,
			  PRIMARY KEY (MUINAISJAANNOSPISTE_ID, AJOITUS_ID),
			  CONSTRAINT fk_MUINAISJAANNOSPISTE_ID FOREIGN KEY (MUINAISJAANNOSPISTE_ID) REFERENCES MUINAISJAANNOSPISTE(ID),
			  CONSTRAINT fk_AJOITUS_ID FOREIGN KEY (AJOITUS_ID) REFERENCES AJOITUS(ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($createTableSql);

		$this->printMessage("Created MUINAISJAANNOSPISTE_AJOITUS table");
	}

	protected function getAjoituksetIdByNameMap() {
		$sql = "
			SELECT ID, NIMI
			FROM AJOITUS
		";
		$ajoitukset = $this->pdo->query($sql)->fetchAll();
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
		$data = $this->pdo->query($sql)->fetchAll();

		$sql = "
			INSERT INTO MUINAISJAANNOSPISTE_AJOITUS (MUINAISJAANNOSPISTE_ID, AJOITUS_ID)
			VALUES (:MUINAISJAANNOSPISTE_ID, :AJOITUS_ID)
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($data as $row) {
			//Data example: 'abc, , , ' or 'abc, def, , '
			$rowAjoitukset = $this->parseAjoituksetStringToArray($row['AJOITUS']);
			foreach ($rowAjoitukset as $rowAjoitus) {
				$stmt->execute([
					':MUINAISJAANNOSPISTE_ID' => $row['ID'],
					':AJOITUS_ID' => $ajoitusIdByNameMap[$rowAjoitus]
				]);
			}
		}

		$this->printMessage("Inserted link data to MUINAISJAANNOSPISTE_AJOITUS table");
	}

	protected function createAndPopoulateTyyppiTable() {
		$createTableSql = "
			CREATE TABLE IF NOT EXISTS TYYPPI (
			  ID int(2) NOT NULL AUTO_INCREMENT,
			  NIMI varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($createTableSql);

		$sql = "
			INSERT INTO TYYPPI(NIMI)
			SELECT DISTINCT TYYPPI
			FROM muinaisjaannospisteet_work
		";
		$this->pdo->query($sql);

		$this->printMessage("Created and populated TYYPPI table");
	}

	protected function updateTyyppiToID() {
		$sql = "
			SELECT ID, NIMI
			FROM TYYPPI
		";
		$tyypit = $this->pdo->query($sql)->fetchAll();

		$sql = "
			UPDATE muinaisjaannospisteet_work
			SET TYYPPI = :TYYPPI_ID
			WHERE TYYPPI = :TYYPPI_NIMI
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($tyypit as $tyyppi) {
			$stmt->execute([
				":TYYPPI_ID" => $tyyppi["ID"],
				":TYYPPI_NIMI" => $tyyppi["NIMI"]
			]);
		}

		$this->printMessage("Replaced tyyppi name with id");
	}

	protected function createAndPopoulateAlatyyppiTable() {
		$createTableSql = "
			CREATE TABLE IF NOT EXISTS ALATYYPPI (
			  ID int(2) NOT NULL AUTO_INCREMENT,
			  NIMI varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($createTableSql);

		$sql = "
			INSERT INTO ALATYYPPI(NIMI)
			SELECT DISTINCT ALATYYPPI
			FROM muinaisjaannospisteet_work
		";
		$this->pdo->query($sql);

		$this->printMessage("Created and populated alatyyppi table");
	}

	protected function updateAlatyyppiToID() {
		$sql = "
			SELECT ID, NIMI
			FROM ALATYYPPI
		";
		$rows = $this->pdo->query($sql)->fetchAll();

		$sql = "
			UPDATE muinaisjaannospisteet_work
			SET ALATYYPPI = :ALATYYPPI_ID
			WHERE ALATYYPPI = :ALATYYPPI_NIMI
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($rows as $row) {
			$stmt->execute([
				":ALATYYPPI_ID" => $row["ID"],
				":ALATYYPPI_NIMI" => $row["NIMI"]
			]);
		}

		$this->printMessage("Replaced ALATYYPPI name with id");
	}

	protected function createAndPopoulateLajiTable() {
		$createTableSql = "
			CREATE TABLE IF NOT EXISTS LAJI (
			  ID int(2) NOT NULL AUTO_INCREMENT,
			  NIMI varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($createTableSql);

		$sql = "
			INSERT INTO LAJI(NIMI)
			SELECT DISTINCT LAJI
			FROM muinaisjaannospisteet_work
		";
		$this->pdo->query($sql);

		$this->printMessage("Created and populated LAJI table");
	}

	protected function updateLajiToID() {
		$sql = "
			SELECT ID, NIMI
			FROM LAJI
		";
		$rows = $this->pdo->query($sql)->fetchAll();

		$sql = "
			UPDATE muinaisjaannospisteet_work
			SET LAJI = :LAJI_ID
			WHERE LAJI = :LAJI_NIMI
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($rows as $row) {
			$stmt->execute([
				":LAJI_ID" => $row["ID"],
				":LAJI_NIMI" => $row["NIMI"]
			]);
		}

		$this->printMessage("Replaced laji name with id");
	}

	protected function createAndPopoulateKuntaTable() {
		$createTableSql = "
			CREATE TABLE IF NOT EXISTS KUNTA (
			  ID int(2) NOT NULL AUTO_INCREMENT,
			  NIMI varchar(50) NOT NULL,
			  PRIMARY KEY (ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($createTableSql);

		$sql = "
			INSERT INTO KUNTA(NIMI)
			SELECT DISTINCT KUNTA
			FROM muinaisjaannospisteet_work
		";
		$this->pdo->query($sql);

		$this->printMessage("Created and populated KUNTA table");
	}

	protected function updateKuntaToID() {
		$sql = "
			SELECT ID, NIMI
			FROM KUNTA
		";
		$rows = $this->pdo->query($sql)->fetchAll();

		$sql = "
			UPDATE muinaisjaannospisteet_work
			SET KUNTA = :KUNTA_ID
			WHERE KUNTA = :KUNTA_NIMI
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($rows as $row) {
			$stmt->execute([
				":KUNTA_ID" => $row["ID"],
				":KUNTA_NIMI" => $row["NIMI"]
			]);
		}

		$this->printMessage("Replaced kunta name with id");
	}

	protected function updateTuhoutunutToBoolean() {
		$sql = "
			UPDATE muinaisjaannospisteet_work
			SET TUHOUTUNUT = :TUHOUTUNUT_NEW
			WHERE TUHOUTUNUT = :TUHOUTUNUT_OLD
		";
		$stmt = $this->pdo->prepare($sql);

		$stmt->execute([
			":TUHOUTUNUT_NEW" => 1,
			":TUHOUTUNUT_OLD" => "Kyllä"
		]);

		$stmt->execute([
			":TUHOUTUNUT_NEW" => 0,
			":TUHOUTUNUT_OLD" => "EI"
		]);

		$this->printMessage("Replaced tuhoutunut name with boolean");
	}

	protected function updateVedenalainenToBoolean() {
		$sql = "
			UPDATE muinaisjaannospisteet_work
			SET VEDENALAIN = :VEDENALAIN_NEW
			WHERE VEDENALAIN = :VEDENALAIN_OLD
		";
		$stmt = $this->pdo->prepare($sql);

		$stmt->execute([
			":VEDENALAIN_NEW" => 1,
			":VEDENALAIN_OLD" => "k"
		]);

		$stmt->execute([
			":VEDENALAIN_NEW" => 0,
			":VEDENALAIN_OLD" => "e"
		]);

		$this->printMessage("Replaced vedenalainen name with boolean");
	}

}
