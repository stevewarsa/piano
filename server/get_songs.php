<?php /** @noinspection SqlResolve */
/** @noinspection PhpParamsInspection */
/** @noinspection SqlNoDataSourceInspection */
/** @noinspection SqlDialectInspection */
error_log("get_songs.php - entering");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

error_log("get_songs.php - opening DB...");
$db = new SQLite3('db/pianopracticetracker.sqlite');
error_log("get_songs.php - DB opened, running query");
$results = $db->query('select SONG_ID, SONG_NM from SONG order by SONG_NM');
error_log("get_songs.php - query ran, processing results");

$songs = array();
while ($row = $results->fetchArray()) {
    $song = new stdClass;
    $song->songId = $row['SONG_ID'];
    $song->songNm = $row['SONG_NM'];
    array_push($songs, $song);
}
error_log("get_songs.php - closing DB");

$db->close();
print_r(json_encode($songs));
