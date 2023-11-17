<?php /** @noinspection SqlNoDataSourceInspection */
/** @noinspection SqlResolve */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$practiceEntryId = $_GET['practiceEntryId'];
$db = null;
$filename = 'db/pianopracticetracker.sqlite';
if (file_exists($filename)) {
	/** @noinspection PhpParamsInspection */
	$db = new SQLite3($filename);
	$statement = $db->prepare('SELECT PES.SONG_ID, SONG_NM from PRACTICE_ENTRY_SONG PES, SONG S 
    	WHERE S.SONG_ID = PES.SONG_ID AND PES.PRACTICE_ENTRY_ID = :practiceEntryId ORDER by SONG_NM DESC');
	$statement->bindValue(':practiceEntryId', $practiceEntryId);
	$results = $statement->execute();
	$songIds = array();
	while ($row = $results->fetchArray()) {
		array_push($songIds, $row['SONG_ID']);
	}

	$db->close();

	print_r(json_encode($songIds));
} else {
	error_log("get_songs_practiced_for_practice_session.php - No database file " . $filename);
	print_r(json_encode("error|There is no database file named " . $filename));
}
?>

