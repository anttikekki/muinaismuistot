<?php
require_once 'MuinaismuistotSettings.php';
require_once 'lib/Medoo/medoo.php';
require_once 'lib/GeoJson/JsonUnserializable.php';
require_once 'lib/GeoJson/GeoJson.php';
require_once 'lib/GeoJson/Geometry/Geometry.php';
require_once 'lib/GeoJson/Geometry/Point.php';
require_once 'lib/GeoJson/Feature/Feature.php';
require_once 'lib/GeoJson/Feature/FeatureCollection.php';


use GeoJson\GeoJson;
use GeoJson\Geometry\Point;
use GeoJson\Feature\Feature;
use GeoJson\Feature\FeatureCollection;

class Muinaismuistot {
	protected $TABLE_MUINAISJAANNOSPISTEET = 'muinaisjaannospisteet';
	protected $TABLE_MUINAISJAANNOSPISTEET_COLUMNS = ['X','Y','KUNTA','MJTUNNUS','KOHDENIMI','AJOITUS','TYYPPI','ALATYYPPI','LAJI','I','P','PAIKANNUST','PAIKANNU0','SELITE','TUHOUTUNUT','LUONTIPVM','MUUTOSPVM','ZALA','ZYLÄ','VEDENALAIN'];
	protected $TABLE_MUINAISJAANNOSPISTEET_COLUMN_TYPE_CONVERSION = [
		'X' => 'double',
		'Y' => 'double',
		'KUNTA' => 'string',
		'MJTUNNUS' => 'integer',
		'KOHDENIMI' => 'string',
		'AJOITUS' => 'string',
		'TYYPPI' => 'string',
		'ALATYYPPI' => 'string',
		'LAJI' => 'string',
		'I' => 'double',
		'P' => 'double',
		'PAIKANNUST' => 'string',
		'PAIKANNU0' => 'string',
		'SELITE' => 'string',
		'TUHOUTUNUT' => 'string',
		'LUONTIPVM' => 'string',
		'MUUTOSPVM' => 'string',
		'ZALA' => 'double',
		'ZYLÄ' => 'double',
		'VEDENALAIN' => 'string'
	];
	protected $settings;
	protected $database;

	public function __construct() {
		$this->settings = new MuinaismuistotSettings();
		$this->database = new medoo([
			'database_type' => 'mysql',
			'database_name' => $this->settings->DB_NAME,
			'server' => $this->settings->DB_SERVER,
			'username' => $this->settings->DB_USERNAME,
			'password' => $this->settings->DB_PASSWORD,
			'charset' => $this->settings->DB_CHARSET
		]);
	}

	protected function castColumnValueToType($value, $name) {
		if(!isset($this->TABLE_MUINAISJAANNOSPISTEET_COLUMN_TYPE_CONVERSION[$name])) {
			return null;
		}

		$type = $this->TABLE_MUINAISJAANNOSPISTEET_COLUMN_TYPE_CONVERSION[$name];
		if($type == 'double') {
			return (double)$value;
		}
		if($type == 'integer') {
			return (int)$value;
		}
		if($type == 'string') {
			return $this->database->quote($value);
		}
		return null;
	}

	protected function getColumns() {
		$columns = ['X','Y','MJTUNNUS'];
		if(isset($_GET['columns']) && is_array($_GET['columns'])) {
			$columns = $_GET['columns'];
		}

		if(in_array('X', $columns)) {
			$columns[] = 'X';
		}
		if(in_array('Y', $columns)) {
			$columns[] = 'Y';
		}

		//Remove unknown columns
		return array_intersect($columns, $this->TABLE_MUINAISJAANNOSPISTEET_COLUMNS);
	}

	protected function getWhere() {
		$where = [];
		foreach ($_GET as $paramName => $paramValue) {
			if($paramName == 'viewbox' && is_array($paramValue) && count($paramValue) == 4) {
				$where['X[<>]'] = [(double)$paramValue[0], (double)$paramValue[2]];
				$where['Y[<>]'] = [(double)$paramValue[1], (double)$paramValue[3]];
			}
			else {
				$value = $this->castColumnValueToType($paramValue, $paramName);
				if(!is_null($value)) {
					$where[$paramName] = $value;
				}
			}
		}

		if(count($where) == 0) {
			$where['LIMIT'] = 10;
		}

		return $where;
	}

	protected function mapToGeoJson($data) {
		$features = [];
		foreach ($data as $row) {
			$point = new Point([(double)$row['X'], (double)$row['Y']]);
			unset($row['X']);
			unset($row['Y']);

			$features[] = new Feature($point, $row);
		}

		return new FeatureCollection($features);
	}

	
	public function runRequest() {
		$queryResults = $this->database->select($this->TABLE_MUINAISJAANNOSPISTEET, $this->getColumns(), $this->getWhere());
		
		header('Content-Type: application/json');
		echo json_encode($this->mapToGeoJson($queryResults));
	}
	
}
