<?php /** @noinspection SqlResolve */
/** @noinspection SqlNoDataSourceInspection */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$song = file_get_contents('php://input');
if (empty($song)) {
	error_log("add_song.php - may be options call - JSON request not sent - exiting");
	exit();
}
error_log("add_song.php - Here is the JSON received: ");
error_log($song);

// now insert or update this practiceEntry
$db = null;
$filename = 'db/pianopracticetracker.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3($filename);
	try {
        $statement = $db->prepare("insert into SONG (SONG_NM) values (:songNm)");
        $statement->bindValue(':songNm', $song);
        $statement->execute();
        $statement->close();
        error_log("add_song.php - Inserted new song...");
        $results = $db->query('SELECT last_insert_rowid() as song_id');
        while ($row = $results->fetchArray()) {
            $songId = $row["song_id"];
            break;
        }
		$db->close();
		print_r(json_encode($songId));
	} catch (Exception $e) {
		error_log("add_song.php - Error inserting or updating song...  Error message: " . $e->getMessage());
		$db->close();
		print_r(json_encode("error|Unable to save song: " . $e->getMessage()));
	}
} else {
	error_log("add_song.php - No database file " . $filename);
	print_r(json_encode("error|There is no database named " . $filename));
}
