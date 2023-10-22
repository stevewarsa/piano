<?php /** @noinspection SqlNoDataSourceInspection */
/** @noinspection SqlResolve */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$db = null;
$filename = 'db/pianopracticetracker.sqlite';
if (file_exists($filename)) {
	/** @noinspection PhpParamsInspection */
	$db = new SQLite3($filename);
	$results = $db->query('SELECT START_DATE_TIME_LONG, START_DATE_TIME_STR, END_DATE_TIME_LONG, END_DATE_TIME_STR, 
       DURATION, PRACTICE_LOCATION, LESSON_CONTENT, NOTES from PIANO_PRACTICE ORDER by START_DATE_TIME_LONG DESC');

	$practiceEntries = array();
	while ($row = $results->fetchArray()) {
		$practiceEntry = new stdClass;
		$practiceEntry->startDtTimeLong = $row['START_DATE_TIME_LONG'];
		$practiceEntry->startDtTimeStr = $row['START_DATE_TIME_STR'];
		$practiceEntry->endDtTimeLong = $row['END_DATE_TIME_LONG'];
		$practiceEntry->endDtTimeStr = $row['END_DATE_TIME_STR'];
		$practiceEntry->duration = $row['DURATION'];
		$practiceEntry->practiceLocation = $row['PRACTICE_LOCATION'];
		$practiceEntry->lessonContent = $row['LESSON_CONTENT'];
		$practiceEntry->notes = $row['NOTES'];
		array_push($practiceEntries, $practiceEntry);
	}

	$db->close();

	print_r(json_encode($practiceEntries));
} else {
	error_log("get_practice_entries.php - No database file " . $filename);
	print_r(json_encode("error|There is no database file named " . $filename));
}
?>

