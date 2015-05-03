<?php

require_once 'MuinaismuistotImportSettings.php';
include_once('lib/GeoPHP/geoPHP.inc');

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
				$this->printMessage('Next: Kunta and Maakunta');
		        break;
		    case 6:
		        //Kunta and maakunta
				$this->createAndPopoulateMaakuntaAndKuntaTable();
				$this->updateKuntaToID();
				$this->insertMaakutaID();
				$this->calculateAndInsertMaakuntaCenterCoordinate();
				$this->printMessage('Next: Kunta and Maakunta center calculation');
		        break;
		    case 7:
		        //Kuntan and Maakunta center calulation
				$this->calculateAndInsertKuntaCenterCoordinate();
				$this->calculateAndInsertMaakuntaCenterCoordinate();
				$this->printMessage('Next: Tuhoutunut ja Vedenalainen');
		        break;

		    case 8:
		        //Tuhoutunut and vedenalainen
				$this->updateTuhoutunutToBoolean();
				$this->updateVedenalainenToBoolean();
				$this->printMessage('Next: Create final table');
		        break;
		    case 9:
		        //Create final table
				$this->dropAndCreateMuinaismuistopisteFinalTable();
				$this->printMessage('Next: Copy data from work table to final');
		        break;
		    case 10:
		        //Final result
				$this->copyMuinaismuistopisteFromWorkToFinal();
				$this->printMessage('Next: Ajoitus');
				break;
		    case 11:
		        //Ajoitus
				$this->createAjoituTable();
				$this->insertDataToAjoitus();
				$this->createMuinaisjaannospisteAjoitusTable();
				$this->insertDataToMuinaisjaannospisteAjoitus();
				$this->printMessage('Next: Create indexes to MUINAISJAANNOSPISTE');
		        break;
		    case 12:
		    	//Create indexes to final table
		    	$this->createIndexesToFinalTable();
		    	$this->printMessage('Next: Drop work table');
		    	break;
		    case 13:
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
			DROP TABLE IF EXISTS MAAKUNTA;
		";
		$this->pdo->query($sql);

		$this->printMessage("Dropped old tables");
	}

	protected function dropAndCreateMuinaismuistopisteWorkTable() {
		$createTableSql = "
			CREATE TABLE muinaisjaannospisteet_work (
			  ID int(8) NOT NULL AUTO_INCREMENT,
			  X decimal(20,12) NOT NULL,
			  Y decimal(20,12) NOT NULL,
			  KUNTA varchar(256) NOT NULL,
			  MAAKUNTA_ID char(3),
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
			CREATE TABLE MUINAISJAANNOSPISTE (
			  ID int(8) NOT NULL,
			  X decimal(20,12) NOT NULL,
			  Y decimal(20,12) NOT NULL,
			  KUNTA_ID CHAR(3) NOT NULL DEFAULT '000',
			  MAAKUNTA_ID CHAR(3) NOT NULL DEFAULT '00',
			  MJTUNNUS int(8) NOT NULL,
			  KOHDENIMI varchar(256) NOT NULL,
			  TYYPPI_ID int(3) NOT NULL,
			  ALATYYPPI_ID int(3) NOT NULL,
			  LAJI_ID int(3) NOT NULL,
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
			  CONSTRAINT fk_MUINAISJAANNOSPISTE_KUNTA FOREIGN KEY (KUNTA_ID) REFERENCES KUNTA(ID),
			  CONSTRAINT fk_MUINAISJAANNOSPISTE_MAAKUNTA FOREIGN KEY (MAAKUNTA_ID) REFERENCES MAAKUNTA(ID),
			  CONSTRAINT fk_MUINAISJAANNOSPISTE_TYYPPI FOREIGN KEY (TYYPPI_ID) REFERENCES TYYPPI(ID),
			  CONSTRAINT fk_MUINAISJAANNOSPISTE_ALATYYPPI FOREIGN KEY (ALATYYPPI_ID) REFERENCES ALATYYPPI(ID),
			  CONSTRAINT fk_MUINAISJAANNOSPISTE_LAJI FOREIGN KEY (LAJI_ID) REFERENCES LAJI(ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($createTableSql);

		$this->printMessage("Created final MUINAISJAANNOSPISTE table");
	}

	protected function copyMuinaismuistopisteFromWorkToFinal() {
		$sql = "
			INSERT INTO MUINAISJAANNOSPISTE(ID,X,Y,KUNTA_ID,MAAKUNTA_ID,MJTUNNUS,KOHDENIMI,TYYPPI_ID,ALATYYPPI_ID,LAJI_ID,PAIKANNUST,PAIKANNU0,SELITE,TUHOUTUNUT,LUONTIPVM,MUUTOSPVM,ZALA,ZYLA,VEDENALAIN)
			SELECT ID,X,Y,KUNTA,MAAKUNTA_ID,MJTUNNUS,KOHDENIMI,TYYPPI,ALATYYPPI,LAJI,PAIKANNUST,PAIKANNU0,SELITE,TUHOUTUNUT,LUONTIPVM,MUUTOSPVM,ZALA,ZYLA,VEDENALAIN
			FROM muinaisjaannospisteet_work
		";
		$this->pdo->query($sql);

		$this->printMessage("Copied muinaisjaannospiste data from work to final");
	}

	protected function createIndexesToFinalTable() {
		$sql = "
			CREATE INDEX id_XY ON MUINAISJAANNOSPISTE (X, Y);
			CREATE INDEX id_MJTUNNUS ON MUINAISJAANNOSPISTE (MJTUNNUS);
		";
		$this->pdo->query($sql);

		$this->printMessage("Created indexes to MUINAISJAANNOSPISTE");
	}

	protected function readNextLineFromCSV(&$filehandle, $separator) {
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

		return fgetcsv($filehandle, $length, $separator);
	}

	protected function openFile($filename) {
		if(!file_exists($filename)) {
			die("Error: $filename file does not exist<br>");
		}

		return fopen($filename, "r");
	}

	protected function importCSVToMuinaismuistopisteWork() {
		$this->printMessage("Starting import to muinaisjaannospisteet_work table");

		$handle = $this->openFile("data".DIRECTORY_SEPARATOR."muinaisjaannospisteet.csv");
		$rowIndex = 0;

		$sql = "
			INSERT INTO muinaisjaannospisteet_work(X,Y,KUNTA,MJTUNNUS,KOHDENIMI,AJOITUS,TYYPPI,ALATYYPPI,LAJI,I,P,PAIKANNUST,PAIKANNU0,SELITE,TUHOUTUNUT,LUONTIPVM,MUUTOSPVM,ZALA,ZYLA,VEDENALAIN)
			VALUES (:X,:Y,:KUNTA,:MJTUNNUS,:KOHDENIMI,:AJOITUS,:TYYPPI,:ALATYYPPI,:LAJI,:I,:P,:PAIKANNUST,:PAIKANNU0,:SELITE,:TUHOUTUNUT,:LUONTIPVM,:MUUTOSPVM,:ZALA,:ZYLA,:VEDENALAIN)
		";
		$stmt = $this->pdo->prepare($sql);

		while (($data = $this->readNextLineFromCSV($handle, ",")) !== false) {
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
			CREATE TABLE AJOITUS (
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
			CREATE TABLE MUINAISJAANNOSPISTE_AJOITUS (
			  MUINAISJAANNOSPISTE_ID int(8) NOT NULL,
			  AJOITUS_ID int(4) NOT NULL,
			  PRIMARY KEY (MUINAISJAANNOSPISTE_ID, AJOITUS_ID),
			  CONSTRAINT fk_MUINAISJAANNOSPISTE_AJOITUS_MUINAISJAANNOSPISTE_ID FOREIGN KEY (MUINAISJAANNOSPISTE_ID) REFERENCES MUINAISJAANNOSPISTE(ID),
			  CONSTRAINT fk_MUINAISJAANNOSPISTE_AJOITUS_AJOITUS_ID FOREIGN KEY (AJOITUS_ID) REFERENCES AJOITUS(ID)
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
			CREATE TABLE TYYPPI (
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
			CREATE TABLE ALATYYPPI (
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
			CREATE TABLE LAJI (
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

	protected function createAndPopoulateMaakuntaAndKuntaTable() {
		$sql = "
			CREATE TABLE MAAKUNTA (
			  ID CHAR(3) NOT NULL,
			  NIMI varchar(50) NOT NULL,
			  CENTERX decimal(20,12),
			  CENTERY decimal(20,12),
			  PRIMARY KEY (ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($sql);

		$sql = "
			CREATE TABLE KUNTA (
			  ID CHAR(3) NOT NULL,
			  NIMI varchar(50) NOT NULL,
			  MAAKUNTA_ID CHAR(2) NOT NULL,
			  CENTERX decimal(20,12),
			  CENTERY decimal(20,12),
			  PRIMARY KEY (ID),
			  CONSTRAINT fk_KUNTA_MAAKUNTA FOREIGN KEY (MAAKUNTA_ID) REFERENCES MAAKUNTA(ID)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		";
		$this->pdo->query($sql);

		$handle = $this->openFile("data".DIRECTORY_SEPARATOR."maakunnat_kunnat.csv");
		$maakunnat = [];
		$kunnat = [];
		$kunnanMaakunta = [];

		while (($data = $this->readNextLineFromCSV($handle, "\t")) !== false) {
			$maakuntakoodi = $data[0];
			$maakuntanimi = $data[1];
			$kuntakoodi = $data[2];
			$kuntanimi = $data[3];
			
			$maakunnat[$maakuntakoodi] = $maakuntanimi;
			$kunnat[$kuntakoodi] = $kuntanimi;
			$kunnanMaakunta[$kuntakoodi] = $maakuntakoodi;
		}

		$sql = "
			INSERT INTO MAAKUNTA(ID, NIMI)
			VALUES (:ID, :NIMI)
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($maakunnat as $koodi => $nimi) {
			$stmt->execute([
				':ID' => $koodi,
				':NIMI' => $nimi
			]);
		}
		$stmt->execute([
			':ID' => '00',
			':NIMI' => 'ei maakuntatietoa'
		]);

		$sql = "
			INSERT INTO KUNTA(ID, NIMI, MAAKUNTA_ID)
			VALUES (:ID, :NIMI, :MAAKUNTA_ID)
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($kunnat as $kuntakoodi => $nimi) {
			$stmt->execute([
				':ID' => $kuntakoodi,
				':NIMI' => $nimi,
				':MAAKUNTA_ID' => $kunnanMaakunta[$kuntakoodi]
			]);
		}
		$stmt->execute([
			':ID' => '00',
			':NIMI' => 'ei kuntatietoa',
			':MAAKUNTA_ID' => '00'
		]);

		fclose($handle);
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

		//Fix Pedersöre --> Pedersören kunta to match kunta csv
		$stmt->execute([
			":KUNTA_ID" => 'Pedersören kunta',
			":KUNTA_NIMI" => 'Pedersöre'
		]);

		foreach ($rows as $row) {
			$stmt->execute([
				":KUNTA_ID" => $row["ID"],
				":KUNTA_NIMI" => $row["NIMI"]
			]);
		}

		$this->printMessage("Replaced kunta name with id");
	}

	protected function insertMaakutaID() {
		$sql = "
			SELECT ID, MAAKUNTA_ID
			FROM KUNTA
		";
		$rows = $this->pdo->query($sql)->fetchAll();

		$sql = "
			UPDATE muinaisjaannospisteet_work
			SET MAAKUNTA_ID = :MAAKUNTA_ID
			WHERE KUNTA = :KUNTA_ID
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($rows as &$row) {
			$stmt->execute([
				":MAAKUNTA_ID" => $row["MAAKUNTA_ID"],
				":KUNTA_ID" => $row["ID"]
			]);
		}

		$this->printMessage("Inserted  data to MAAKUNTA_ID");
	}

	protected function calculateAndInsertMaakuntaCenterCoordinate() {
		$maakuntarajatGeoJsonString = file_get_contents("data/maakuntarajat.geojson");
		$maakuntarajatGeoJson = json_decode($maakuntarajatGeoJsonString);
		$maakuntarajaFeatures = $maakuntarajatGeoJson->features;

		$sql = "
			UPDATE MAAKUNTA
			SET CENTERX = :CENTERX, CENTERY = :CENTERY
			WHERE ID = :MAAKUNTA_ID
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($maakuntarajaFeatures as &$maakuntarajaFeature) {
			$maakuntarajaGeometry = geoPHP::load($maakuntarajaFeature,'geojson');
			$centroid = $maakuntarajaGeometry->centroid();
			$maakuntakoodi = $maakuntarajaFeature->properties->maakuntakoodi;

			$stmt->execute([
				":CENTERX" => $centroid->x(),
				":CENTERY" => $centroid->y(),
				":MAAKUNTA_ID" => $maakuntakoodi
			]);
		}

		$this->printMessage("Calculated Maakunta center point");
	}

	protected function calculateAndInsertKuntaCenterCoordinate() {
		$kuntarajatGeoJsonString = file_get_contents("data/kuntarajat.geojson");
		$kuntarajatGeoJson = json_decode($kuntarajatGeoJsonString);
		$kuntarajaFeatures = $kuntarajatGeoJson->features;

		$sql = "
			UPDATE KUNTA
			SET CENTERX = :CENTERX, CENTERY = :CENTERY
			WHERE ID = :KUNTA_ID
		";
		$stmt = $this->pdo->prepare($sql);

		foreach ($kuntarajaFeatures as &$kuntarajaFeature) {
			$kuntarajaGeometry = geoPHP::load($kuntarajaFeature,'geojson');
			$centroid = $kuntarajaGeometry->centroid();
			$kuntakoodi = $kuntarajaFeature->properties->kuntakoodi;

			$stmt->execute([
				":CENTERX" => $centroid->x(),
				":CENTERY" => $centroid->y(),
				":KUNTA_ID" => $kuntakoodi
			]);
		}

		$this->printMessage("Calculated Kunta center point");
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
