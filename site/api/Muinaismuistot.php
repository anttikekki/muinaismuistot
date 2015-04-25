<?php
require_once 'MuinaismuistotSettings.php';
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
	protected $TABLE_MUINAISJAANNOSPISTEET = 'MUINAISJAANNOSPISTE';
	protected $TABLE_MUINAISJAANNOSPISTEET_COLUMNS = ['X','Y','KUNTA','MJTUNNUS', 'AJOITUS', 'KOHDENIMI','TYYPPI','ALATYYPPI','LAJI','PAIKANNUST','PAIKANNU0','SELITE','TUHOUTUNUT','LUONTIPVM','MUUTOSPVM','ZALA','ZYLÄ','VEDENALAIN'];
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
	protected $TABLE_MUINAISJAANNOSPISTEET_COLUMN_JOIN = ['KUNTA', 'AJOITUS', 'TYYPPI', 'ALATYYPPI', 'LAJI'];
	protected $FILTERS;
	protected $settings;
	protected $pdo;

	public function __construct() {
		$this->settings = new MuinaismuistotSettings();
		$this->initDatabase();

		$this->FILTERS = array_merge($this->TABLE_MUINAISJAANNOSPISTEET_COLUMNS, ['viewbox']);
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

	protected function getSelectColumns() {
		$columns = ['X','Y','MJTUNNUS'];
		if(isset($_GET['columns'])) {
			$columns = explode(",", $_GET['columns']);
		}

		//Remove unknown columns
		return array_intersect($columns, $this->TABLE_MUINAISJAANNOSPISTEET_COLUMNS);
	}

	protected function getSelectSql() {
		$select = [];

		foreach ($this->getSelectColumns() as $column) {
			if(in_array($column, $this->TABLE_MUINAISJAANNOSPISTEET_COLUMN_JOIN)) {
				$select[] = "$column.NIMI AS $column";
				if($column === 'AJOITUS') {
					array_unshift($select, "MUINAISJAANNOSPISTE.ID");
				}
			}
			else {
				$select[] = $column;
			}
		}

		$sql = " SELECT ";
		if(in_array("MUINAISJAANNOSPISTE.ID", $select)) {
			//To remove duplicates if MUINAISMUISTOPISTE_AJOITUS is joined
			$sql .= " DISTINCT ";
		}

		return $sql . implode(", ", $select);
	}

	protected function getSqlJoins() {
		$allRequiredFields = array_merge($this->getSelectColumns(), $this->getFilters());

		$sql = "";
		foreach ($allRequiredFields as $column) {
			if(in_array($column, $this->TABLE_MUINAISJAANNOSPISTEET_COLUMN_JOIN)) {
				if($column === 'AJOITUS') {
					$sql .= " INNER JOIN MUINAISJAANNOSPISTE_AJOITUS ON MUINAISJAANNOSPISTE.ID = MUINAISJAANNOSPISTE_AJOITUS.MUINAISJAANNOSPISTE_ID ";
					$sql .= " INNER JOIN AJOITUS ON MUINAISJAANNOSPISTE_AJOITUS.AJOITUS_ID = AJOITUS.ID ";
				}
				else {
					$sql .= " LEFT JOIN $column ON MUINAISJAANNOSPISTE.$column = $column.ID ";
				}
			}
		}
		return $sql;
	}

	protected function getFilters() {
		$filters = [];
		foreach ($_GET as $paramName => $paramValue) {
			if(in_array($paramName, $this->FILTERS)) {
				$filters[] = $paramName;
			}
		}
		return $filters;
	}

	protected function getFilterSqlValue($filter) {
		$value = $_GET[$filter];

		$type = $this->TABLE_MUINAISJAANNOSPISTEET_COLUMN_TYPE_CONVERSION[$filter];
		if($type == 'double') {
			return (double)$value;
		}
		if($type == 'integer') {
			return (int)$value;
		}
		if($type == 'string') {
			return $this->pdo->quote($value);
		}
		return null;
	}

	protected function getSqlWhere() {
		$where = [];
		foreach ($this->getFilters() as $filter) {
			if($filter == 'viewbox') {
				//ViewBox = [minX, minY, maxX, maxY]
				$viewbox = explode(",", $_GET[$filter]);
				if(count($viewbox) != 4) {
					continue;
				}

				$where[] = " X BETWEEN " . (double)$viewbox[0] . " AND " . (double)$viewbox[2];
				$where[] = " Y BETWEEN " . (double)$viewbox[1] . " AND " . (double)$viewbox[3];
			}
			else {
				$where[] = " $filter = " . $this->getFilterSqlValue($filter);
			}
		}

		if(count($where) == 0) {
			return "";
		}

		return " WHERE " . implode(" AND ", $where);
	}

	protected function getSql() {
		$sql = $this->getSelectSql();
		$sql .= " FROM " . $this->TABLE_MUINAISJAANNOSPISTEET;
		$sql .= $this->getSqlJoins();
		$sql .= $this->getSqlWhere();

		return $sql;
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
		header('Content-Type: application/json');

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
		//print_r($this->getSql());
		$queryResults = $this->pdo->query($this->getSql())->fetchAll(PDO::FETCH_ASSOC);
		
		echo $this->toJson($queryResults);
	}
	
}
