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
	protected $TABLE_MUINAISJAANNOSPISTEET_COLUMNS = ['X','Y','KUNTA','MJTUNNUS','KOHDENIMI','TYYPPI','ALATYYPPI','LAJI','PAIKANNUST','PAIKANNU0','SELITE','TUHOUTUNUT','LUONTIPVM','MUUTOSPVM','ZALA','ZYLÄ','VEDENALAIN'];
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
		'PAIKANNUST' => 'string',
		'PAIKANNU0' => 'string',
		'SELITE' => 'string',
		'TUHOUTUNUT' => 'string',
		'LUONTIPVM' => 'string',
		'MUUTOSPVM' => 'string',
		'ZALA' => 'double',
		'ZYLA' => 'double',
		'VEDENALAIN' => 'string'
	];
	protected $TABLE_MUINAISJAANNOSPISTEET_COLUMN_JOIN = ['KUNTA', 'KOHDENIMI', 'AJOITUS', 'TYYPPI', 'ALATYYPPI', 'LAJI'];
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
		if(isset($_GET['columns'])) {
			$columns = explode(",", $_GET['columns']);
		}

		//Remove unknown columns
		return array_intersect($columns, $this->TABLE_MUINAISJAANNOSPISTEET_COLUMNS);
	}

	protected function getSqlJoins($columns) {
		$sql = "";
		foreach ($columns as $column) {
			if(in_array($column, $this->TABLE_MUINAISJAANNOSPISTEET_COLUMN_JOIN)) {
				if($column == 'AJOITUS') {
					$sql .= " INNER JOIN $column ON mjpiste.$column = $column.ID ";
					$sql .= " INNER JOIN $column ON mjpiste.$column = $column.ID ";
				}
				else {
					$sql .= " LEFT JOIN $column ON mjpiste.$column = $column.ID ";
				}
			}
		}
		return $sql;
	}

	protected function getWhere() {
		$where = [
			'AND' => []
		];
		foreach ($_GET as $paramName => $paramValue) {
			if($paramName == 'viewbox') {
				//ViewBox = [minX, minY, maxX, maxY]
				$viewbox = explode(",", $paramValue);
				if(count($viewbox) != 4) {
					continue;
				}

				$where['AND']['X[<>]'] = [(double)$viewbox[0], (double)$viewbox[2]];
				$where['AND']['Y[<>]'] = [(double)$viewbox[1], (double)$viewbox[3]];
			}
			else {
				$value = $this->castColumnValueToType($paramValue, $paramName);
				if(!is_null($value)) {
					$where['AND'][$paramName] = $value;
				}
			}
		}

		if(count($where['AND']) == 0) {
			$where['LIMIT'] = 10;
		}

		return $where;
	}

	protected function mapToGeoJson($data) {
		$features = [];

		if(is_array($data)) {
			foreach ($data as $row) {
				$point = new Point([(double)$row['X'], (double)$row['Y']]);
				unset($row['X']);
				unset($row['Y']);

				$features[] = new Feature($point, $row);
			}
		}

		return new FeatureCollection($features);
	}

	protected function toJson($data) {
		$format = 'geojson';
		if(isset($_GET['format'])) {
			$format = $_GET['format'];
		}

		if($format == 'json') {
			return json_encode($data);
		}
		else {
			return json_encode($this->mapToGeoJson($data));
		}
	}
	
	public function runRequest() {
		$queryResults = $this->database->select($this->TABLE_MUINAISJAANNOSPISTEET, $this->getColumns(), $this->getWhere());

		header('Content-Type: application/json');
		echo $this->toJson($queryResults);
	}
	
}
