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
	protected $TABLES = ['MUINAISJAANNOSPISTE'];
	protected $FILTERS = [ 
		'MUINAISJAANNOSPISTE' => [
			'viewbox',
			'COUNT',
			'ID',
			'X',
			'Y',
			'KUNTA',
			'KUNTA_ID',
			'MAAKUNTA',
			'MAAKUNTA_ID',
			'MJTUNNUS',
			'AJOITUS',
			'KOHDENIMI',
			'TYYPPI',
			'TYYPPI_ID',
			'ALATYYPPI',
			'ALATYYPPI_ID',
			'LAJI',
			'LAJI_ID',
			'PAIKANNUST',
			'PAIKANNU0',
			'SELITE',
			'TUHOUTUNUT',
			'LUONTIPVM',
			'MUUTOSPVM',
			'ZALA',
			'ZYLA',
			'VEDENALAIN']
	];
	protected $DATATYPE = [ 
		'MUINAISJAANNOSPISTE' => [
			'X' => 'double',
			'Y' => 'double',
			'KUNTA' => 'string',
			'KUNTA_ID' => 'string',
			'MAAKUNTA' => 'string',
			'MAAKUNTA_ID' => 'string',
			'MJTUNNUS' => 'integer',
			'KOHDENIMI' => 'string',
			'AJOITUS' => 'string',
			'TYYPPI' => 'string',
			'TYYPPI_ID' => 'integer',
			'ALATYYPPI' => 'string',
			'ALATYYPPI_ID' => 'integer',
			'LAJI' => 'string',
			'LAJI_ID' => 'integer',
			'PAIKANNUST' => 'string',
			'PAIKANNU0' => 'string',
			'SELITE' => 'string',
			'TUHOUTUNUT' => 'string',
			'LUONTIPVM' => 'string',
			'MUUTOSPVM' => 'string',
			'ZALA' => 'double',
			'ZYLA' => 'double',
			'VEDENALAIN' => 'string'
		]
	];
	protected $JOINS = [ 
		'MUINAISJAANNOSPISTE' => ['KUNTA', 'TYYPPI', 'ALATYYPPI', 'LAJI', 'AJOITUS']
	];
	protected $LEFT_JOINS = [ 
		'MUINAISJAANNOSPISTE' => ['KUNTA', 'TYYPPI', 'ALATYYPPI', 'LAJI']
	];
	protected $INNER_JOINS = [
		'MUINAISJAANNOSPISTE' => ['AJOITUS']
	];

	protected $settings;
	protected $pdo;

	public function __construct() {
		$this->settings = new MuinaismuistotSettings();
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

	protected function getSelectColumns($params) {
		$data = $this->getSelectedData($params);

		$columns = ['X','Y','MJTUNNUS'];
		if(isset($params['columns'])) {
			$columns = explode(",", $params['columns']);
		}

		//Remove unknown columns
		$columns = array_intersect($columns, $this->FILTERS[$data]);

		if(count(array_intersect($columns, $this->INNER_JOINS[$data])) > 0) {
			//Add ID for inner join queries to ebale GROUP BY ID to remove duplicates
			array_unshift($columns, "$data.ID");
		}

		return $columns;
	}

	protected function getSelectSql($params) {
		$select = [];
		$columns = $this->getSelectColumns($params);
		$data = $this->getSelectedData($params);

		foreach ($columns as $column) {
			if(in_array($column, $this->LEFT_JOINS[$data])) {
				$select[] = "$column.NIMI AS $column";
			}
			elseif(in_array($column, $this->INNER_JOINS[$data])) {
				$select[] = "GROUP_CONCAT($column.NIMI) AS $column";
			}
			else {
				$select[] = $column;
			}
		}

		return " SELECT " . implode(", ", $select);
	}

	protected function hasInnerJoins($params) {
		return count($this->getInnerJoinColumns($params)) > 0;
	}

	protected function getInnerJoinColumns($params) {
		$columns = $this->getSelectColumns($params);
		$data = $this->getSelectedData($params);

		return array_intersect($columns, $this->INNER_JOINS[$data]);
	}

	protected function getSqlJoins($params) {
		$allRequiredFields = array_merge($this->getSelectColumns($params), $this->getFilters($params));
		$data = $this->getSelectedData($params);

		$sql = "";
		foreach ($allRequiredFields as $column) {
			if(in_array($column, $this->INNER_JOINS[$data])) {
				$linkTable = $data ."_".$column;
				$sql .= " INNER JOIN $linkTable ON $data.ID = $linkTable.{$data}_ID ";
				$sql .= " LEFT JOIN $column ON $linkTable.{$column}_ID = $column.ID ";
			}
			if(in_array($column, $this->LEFT_JOINS[$data])) {
				$sql .= " LEFT JOIN $column ON $data.{$column}_ID = $column.ID ";
			}
		}
		return $sql;
	}

	protected function getFilters($params) {
		$filters = [];
		$data = $this->getSelectedData($params);

		foreach ($params as $paramName => $paramValue) {
			if(in_array($paramName, $this->FILTERS[$data])) {
				$filters[] = $paramName;
			}
		}
		return $filters;
	}

	protected function getFilterSqlValue($filter, $params) {
		$value = $params[$filter];
		$data = $this->getSelectedData($params);

		$type = $this->DATATYPE[$data][$filter];
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

	protected function getSqlWhere($params) {
		$where = [];
		foreach ($this->getFilters($params) as $filter) {
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
				$where[] = " $filter = " . $this->getFilterSqlValue($filter, $params);
			}
		}

		if(count($where) == 0) {
			return "";
		}

		return " WHERE " . implode(" AND ", $where);
	}

	protected function getSelectedData($params) {
		if(isset($params['data'])) {
			if(in_array($params['data'], $this->TABLES)) {
				return $params['data'];
			}
		}
		return 'MUINAISJAANNOSPISTE'; 
	}

	protected function getSqlFrom($params) {
		return ' FROM ' . $this->getSelectedData($params);
	}

	protected function getSqlGroupBy($params) {
		if($this->hasInnerJoins($params)) {
			//GROUP BY to merge INNER JOIN data to one row
			$innerJoinColumns = $this->getInnerJoinColumns($params);
			$allColumns = $this->getSelectColumns($params);
			return " GROUP BY " . implode(", ", array_diff($allColumns, $innerJoinColumns));
		}

		return '';
	}

	protected function getSql($params) {
		$sql = $this->getSelectSql($params);
		$sql .= $this->getSqlFrom($params);
		$sql .= $this->getSqlJoins($params);
		$sql .= $this->getSqlWhere($params);
		$sql .= $this->getSqlGroupBy($params);

		return $sql;
	}

	protected function toGeoJson($data, $params) {
		$features = [];

		if(is_array($data)) {
			foreach ($data as &$row) {
				$point = new Point([(double)$row['X'], (double)$row['Y']]);
				unset($row['X']);
				unset($row['Y']);

				$features[] = new Feature($point, $row);
			}
		}

		return new FeatureCollection($features);
	}

	protected function toJson($data, $params) {
		$innerJoins = $this->getInnerJoinColumns($params);

		if(count($innerJoins) === 0) {
			return $data;
		}

		foreach ($data as &$row) {
			foreach ($innerJoins as $innerJoin) {
				//Change GROUP_CONCAT String to Array
				$row[$innerJoin] = explode(',', $row[$innerJoin]);
			}
			
		}
		return $data;
	}

	protected function printResult($data, $params) {
		header('Content-Type: application/json');

		$format = 'geojson';
		if(isset($params['format'])) {
			$format = $params['format'];
		}

		if($format === 'json') {
			echo json_encode($this->toJson($data, $params));
		}
		else {
			echo json_encode($this->toGeoJson($data, $params));
		}
	}
	
	public function runRequest($params) {
		//print_r($this->getSql($params));
		$queryResults = $this->pdo->query($this->getSql($params))->fetchAll(PDO::FETCH_ASSOC);
		
		$this->printResult($queryResults, $params);
	}
	
}
