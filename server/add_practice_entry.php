<?php /** @noinspection PhpParamsInspection */
/** @noinspection SqlResolve */
/** @noinspection SqlNoDataSourceInspection */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("add_practice_entry.php - may be options call - JSON request not sent - exiting");
	exit();
}
error_log("add_practice_entry.php - Here is the JSON received: ");
error_log($request);
$practiceEntry = json_decode($request);

// now insert or update this practiceEntry
$db = null;
$filename = 'db/pianopracticetracker.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3($filename);
	try {
		$statement = $db->prepare('update PIANO_PRACTICE set START_DATE_TIME_STR = :startDateTimeStr,
                          END_DATE_TIME_LONG = :endDateTimeLong, END_DATE_TIME_STR = :endDateTimeString,
                          DURATION = :duration, PRACTICE_LOCATION = :practiceLocation, 
                          LESSON_CONTENT = :lessonContent, NOTES = :notes 
                        where START_DATE_TIME_LONG = :startDateTimeLong');
		$statement->bindValue(':startDateTimeLong', $practiceEntry->startDtTimeLong);
		$statement->bindValue(':startDateTimeStr', $practiceEntry->startDtTimeStr);
        $statement->bindValue(':endDateTimeLong', $practiceEntry->endDtTimeLong);
        $statement->bindValue(':endDateTimeString', $practiceEntry->endDtTimeStr);
        $statement->bindValue(':duration', $practiceEntry->duration);
        $statement->bindValue(':practiceLocation', $practiceEntry->practiceLocation);
        $statement->bindValue(':lessonContent', $practiceEntry->lessonContent);
        $statement->bindValue(':notes', $practiceEntry->notes);
		$statement->execute();
		$statement->close();
        if ($db->changes() >= 1) {
            // an update was made, which means a practice entry already existed.  Therefore, delete the related songs
            // and save them again, in case they changed
            error_log("add_practice_entry.php - On updated practice entry, removing related songs practiced...");
            $statement = $db->prepare("delete from PRACTICE_ENTRY_SONG where PRACTICE_ENTRY_ID = :startDateTimeLong");
            $statement->bindValue(':startDateTimeLong', $practiceEntry->startDtTimeLong);
            $statement->execute();
            $statement->close();
            $statement = null;
            if (sizeof($practiceEntry->songsPracticed) > 0) {
                error_log("add_practice_entry.php - On updated practice entry, inserting related songs practiced...");
                foreach ($practiceEntry->songsPracticed as $songId) {
                    $statement = $db->prepare("insert into PRACTICE_ENTRY_SONG 
                        (PRACTICE_ENTRY_ID, SONG_ID) values (:startDateTimeLong,:songId)");
                    $statement->bindValue(':startDateTimeLong', $practiceEntry->startDtTimeLong);
                    $statement->bindValue(':songId', $songId);
                    $statement->execute();
                    $statement->close();
                    $statement = null;
                }
            }
        }

		if ($db->changes() < 1) {
			$statement = $db->prepare("insert into PIANO_PRACTICE 
                (START_DATE_TIME_LONG, START_DATE_TIME_STR, END_DATE_TIME_LONG, 
                 END_DATE_TIME_STR,DURATION, PRACTICE_LOCATION, 
                 LESSON_CONTENT, NOTES) values 
                (:startDateTimeLong,:startDateTimeStr,:endDateTimeLong,
                 :endDateTimeString, :duration, :practiceLocation,
                 :lessonContent, :notes
                )"
            );
            $statement->bindValue(':startDateTimeLong', $practiceEntry->startDtTimeLong);
            $statement->bindValue(':startDateTimeStr', $practiceEntry->startDtTimeStr);
            $statement->bindValue(':endDateTimeLong', $practiceEntry->endDtTimeLong);
            $statement->bindValue(':endDateTimeString', $practiceEntry->endDtTimeStr);
            $statement->bindValue(':duration', $practiceEntry->duration);
            $statement->bindValue(':practiceLocation', $practiceEntry->practiceLocation);
            $statement->bindValue(':lessonContent', $practiceEntry->lessonContent);
            $statement->bindValue(':notes', $practiceEntry->notes);
			$statement->execute();
			$statement->close();
			error_log("add_practice_entry.php - Inserted new practiceEntry...");
            if (sizeof($practiceEntry->songsPracticed) > 0) {
                error_log("add_practice_entry.php - Inserting related songs practiced...");
                foreach ($practiceEntry->songsPracticed as $songId) {
                    $statement = $db->prepare("insert into PRACTICE_ENTRY_SONG 
                        (PRACTICE_ENTRY_ID, SONG_ID) values (:startDateTimeLong,:songId)");
                    $statement->bindValue(':startDateTimeLong', $practiceEntry->startDtTimeLong);
                    $statement->bindValue(':songId', $songId);
                    $statement->execute();
                    $statement->close();
                    $statement = null;
                }
            }
		} else {
			error_log("add_practice_entry.php - Updated practiceEntry...");
		}
		$db->close();
		print_r(json_encode($practiceEntry));
	} catch (Exception $e) {
		error_log("add_practice_entry.php - Error inserting or updating practiceEntry...  Error message: " . $e->getMessage());
		$db->close();
		print_r(json_encode($practiceEntry));
	}
} else {
	error_log("add_practice_entry.php - No database file " . $filename);
	print_r(json_encode("error|There is no database named " . $filename));
}
