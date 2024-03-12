import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import SpinnerTimer from "../components/SpinnerTimer";
import practiceService from "../services/practice-service";
import {stateActions} from "../store";
import {DateUtils} from "../helpers/date.utils";
import {PracticeEntry} from "../model/practice-entry";
import {Song} from "../model/song";
import {AppState} from "../model/AppState";
import EditDateComponent from "../components/EditDateComponent";
import EnterNoPracticeReasonComponent from "../components/EnterNoPracticeReasonComponent";
import AddSongComponent from "../components/AddSongComponent";
import SubmitConfirmComponent from "../components/SubmitConfirmComponent";
import NextPrevNavigationComponent from "../components/NextPrevNavigationComponent";
import {editedTimeFormat, timeFormat, timeOnlyFormat} from "../model/format-constants";

const startTime = new Date().getTime();
const AddPracticeSession = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const songs: Song[] = useSelector((st: AppState) => st.songs);
    const practiceEntries: PracticeEntry[] = useSelector((st: AppState) => st.practiceEntries);
    const [busy, setBusy] = useState({state: false, message: ""});
    const [practiceStartTime, setPracticeStartTime] = useState<number>(() => {
        const pstart = localStorage.getItem("practiceStartTime");
        if (pstart) {
            return parseInt(pstart, 10);
        } else {
            console.log("AddPracticeSession.useState - setting practiceStartTime in localStorage to " + startTime);
            localStorage.setItem("practiceStartTime", "" + startTime);
            return startTime;
        }
    });
    const [practiceStartTimeStr, setPracticeStartTimeStr] = useState<string>(() => {
        const pstart = localStorage.getItem("practiceStartTime");
        const stDtTime =  pstart ? parseInt(pstart, 10) : startTime;
        return DateUtils.formatDateTime(new Date(stDtTime), timeFormat)
    });
    const [practiceEndTime, setPracticeEndTime] = useState<number>(() => {
        const pend = localStorage.getItem("practiceEndTime");
        return pend ? parseInt(pend, 10) : undefined;
    });
    const [practiceEndTimeStr, setPracticeEndTimeStr] = useState<string>(() => {
        const pend = localStorage.getItem("practiceEndTime");
        return pend ? DateUtils.formatDateTime(new Date(parseInt(pend, 10)), timeFormat) : "N/A";
    });
    const [practiceLocation, setPracticeLocation] = useState<string>("Church");
    const [lessonContent, setLessonContent] = useState<string>(() => localStorage.getItem("lessonContent") || "");
    const [notes, setNotes] = useState<string>(localStorage.getItem("notes") || "");
    const [duration, setDuration] = useState<number>(-1);
    const [show, setShow] = useState<boolean>(false);
    const [editingStartDateTime, setEditingStartDateTime] = useState<boolean>(false);
    const [editedDateString, setEditedDateString] = useState<string>("");
    const [showReason, setShowReason] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [submitValidationReasons, setSubmitValidationReasons] = useState<string[]>([]);
    const [noPracticeReason, setNoPracticeReason] = useState<string>("");
    const [showAddSong, setShowAddSong] = useState<boolean>(false);
    const [showSongList, setShowSongList] = useState<boolean>(false);
	const [songName, setSongName] = useState<string>("");
	const [selectedSongs, setSelectedSongs] = useState<Song[]>(() => {
        const selSongsStr = localStorage.getItem("selectedSongs");
        if (selSongsStr && selSongsStr.length > 0) {
            return JSON.parse(selSongsStr);
        } else {
            return [];
        }
    });
    const [nextEntryIndex, setNextEntryIndex] = useState<number>(-1);
    const [prevEntryIndex, setPrevEntryIndex] = useState<number>(-1);
    const [currEntryIndex, setCurrEntryIndex] = useState<number>(-1);
    const [editingExistingEntry, setEditingExistingEntry] = useState<boolean>(false);
    let location = useLocation();

    const loadSongs = async () => {
        if (!songs || songs.length === 0) {
            console.log("AddPracticeSession.useEffect[] - Songs are not loaded yet, so call server to load them...");
            const locSongs = await practiceService.getSongs();
            const songResponse: Song[] = locSongs.data;
			songResponse.sort((a, b) => {
			  const nameA = a.songNm.toUpperCase();
			  const nameB = b.songNm.toUpperCase();
			  if (nameA < nameB) {
				return -1;
			  }
			  if (nameA > nameB) {
				return 1;
			  }
			  return 0;
			});
            dispatch(stateActions.setSongs(songResponse));
            return songResponse;
        } else {
            return songs;
        }
    }

    useEffect(() => {
        // when this component initially loads, get the songs if not already loaded
        loadSongs();
        if (!practiceEntries || practiceEntries.length === 0) {
            practiceService.getPracticeEntries().then(async practiceData => {
                const entries: PracticeEntry[] = practiceData.data;
                dispatch(stateActions.setPracticeEntries(entries));
                setBusy({state: false, message: ""});
                console.log("AllEntries.useEffect[] - here are all the practice entries:", practiceData.data);
            });
        }
    }, []);

    useEffect(() => {
        const formattedDate = DateUtils.formatDateTime(new Date(practiceStartTime), timeFormat);
        const formattedDateForEditing = DateUtils.formatDateTime(new Date(practiceStartTime), editedTimeFormat);
        setPracticeStartTimeStr(formattedDate);
        setEditedDateString(formattedDateForEditing);
        console.log("AddPracticeSession.useEffect[practiceStartTime] - setting practiceStartTime in localStorage to " + practiceStartTime);
        localStorage.setItem("practiceStartTime", practiceStartTime + "");
    }, [practiceStartTime]);

    useEffect(() => {
        console.log("AddPracticeSession.useEffect[practiceEndTime] - practiceEndTime = " + practiceEndTime + ", practiceEndTimeStr = " + practiceEndTimeStr + ", practiceStartTime = " + practiceStartTime + ", practiceStartTimeStr = " + practiceStartTimeStr);
        if (typeof practiceEndTime !== "undefined" && typeof practiceStartTime !== "undefined") {
            console.log("AddPracticeSession.useEffect[practiceEndTime] - setting practiceEndTimeStr to " + DateUtils.formatDateTime(new Date(practiceEndTime), timeFormat));
            setPracticeEndTimeStr(DateUtils.formatDateTime(new Date(practiceEndTime), timeFormat));
            setDuration(DateUtils.minutesInBetween(new Date(practiceEndTime), new Date(practiceStartTime)));
            console.log("AddPracticeSession.useEffect[practiceStartTime] - setting practiceEndTime in localStorage to " + practiceEndTime);
            localStorage.setItem("practiceEndTime", practiceEndTime + "");
        }
    }, [practiceEndTime]);

    useEffect(() => {
        if (notes && notes.trim().length > 0) {
            localStorage.setItem("notes", notes);
            console.log("AddPracticeSession.useEffect[notes] - setting notes in localStorage to '" + notes + "'");
        } else {
            console.log("AddPracticeSession.useEffect[notes] - removing notes from localStorage...");
            localStorage.removeItem("notes");
        }
    }, [notes]);

    useEffect(() => {
        if (selectedSongs && selectedSongs.length > 0) {
            const songsJson = JSON.stringify(selectedSongs);
            localStorage.setItem("selectedSongs", songsJson);
            console.log("AddPracticeSession.useEffect[selectedSongs] - setting selectedSongs in localStorage to '" + songsJson + "'");
        } else {
            console.log("AddPracticeSession.useEffect[selectedSongs] - removing selectedSongs from localStorage...");
            localStorage.removeItem("selectedSongs");
        }
    }, [selectedSongs]);

    useEffect(() => {
        setBusy({state: true, message: "Loading practice entries from DB..."});
        practiceService.getPracticeEntries().then(practiceData => {
            dispatch(stateActions.setPracticeEntries(practiceData.data));
            setBusy({state: false, message: ""});
        });
        if (location?.state?.hasOwnProperty("startDtTimeLong")) {
            handleEditCase(location.state as PracticeEntry);
        } else {
            // make sure to update the start time everytime this component is mounted
            const pstart = localStorage.getItem("practiceStartTime");
            let newStartTime: number;
            if (pstart) {
                newStartTime = parseInt(pstart, 10);
            } else {
                console.log("AddPracticeSession.useState - setting practiceStartTime in localStorage to " + startTime);
                localStorage.setItem("practiceStartTime", "" + startTime);
                newStartTime = startTime;
            }
            setPracticeStartTime(newStartTime);
            setPracticeStartTimeStr(DateUtils.formatDateTime(new Date(newStartTime), timeFormat));
        }
    }, [dispatch]);

    const handleEditCase = (practiceEntryToEdit: PracticeEntry) => {
        console.log("AddPracticeSession.useEffect[dispatch] - practiceEntryToEdit: ", practiceEntryToEdit);
        const currentEntryIndex = practiceEntries?.findIndex(pe => pe.startDtTimeLong === practiceEntryToEdit.startDtTimeLong);
        if (currentEntryIndex >= 0) {
            setCurrEntryIndex(currentEntryIndex);
            setNextEntryIndex(currentEntryIndex === (practiceEntries?.length - 1) ? 0 : currentEntryIndex + 1);
            setPrevEntryIndex(currentEntryIndex === 0 ? (practiceEntries?.length - 1) : currentEntryIndex - 1);
        }
        setPracticeStartTime(parseInt(String(practiceEntryToEdit.startDtTimeLong)));
        setPracticeStartTimeStr(practiceEntryToEdit.startDtTimeStr);
        setPracticeLocation(practiceEntryToEdit.practiceLocation);
        setNotes(practiceEntryToEdit.notes);
        setLessonContent(practiceEntryToEdit.lessonContent);
        setPracticeEndTime(parseInt(String(practiceEntryToEdit.endDtTimeLong)));
        setPracticeEndTimeStr(practiceEntryToEdit.endDtTimeStr);
        setDuration(parseInt(String(practiceEntryToEdit.duration)));
        if (practiceEntryToEdit.songsPracticed && practiceEntryToEdit.songsPracticed.length > 0) {
            if (!songs || songs.length === 0) {
                loadSongs().then(songsJustLoaded => {
                    const songsPracticedForEntry = practiceEntryToEdit.songsPracticed.map(songId => songsJustLoaded.find(s => s.songId === songId));
                    console.log("AddPracticeSession.useEffect[dispatch] - setting selected songs to:", songsPracticedForEntry);
                    setSelectedSongs(songsPracticedForEntry);
                    setShowSongList(true);
                });
            } else {
                const songsPracticedForEntry = practiceEntryToEdit.songsPracticed.map(songId => songs.find(s => s.songId === songId));
                console.log("AddPracticeSession.useEffect[dispatch] - setting selected songs to:", songsPracticedForEntry);
                setSelectedSongs(songsPracticedForEntry);
                setShowSongList(true);
            }
        } else {
            // no songs marked as practiced this session, so empty out the selected songs
            setSelectedSongs([]);
        }
        setEditingExistingEntry(true);
    }

    const handleLessonContent = (event: any) => {
        console.log("AddPracticeSession.handleLessonContent - setting lessonContent to: '" + event.target.value + "'");
        localStorage.setItem("lessonContent", event.target.value);
        setLessonContent(event.target.value);
    };

    const handleNotes = (event: any) => {
        setNotes(event.target.value);
    };

    const handleShowAddSong = () => {
        setSongName("");
        setShowAddSong(true);
    };

    const handleClose = () => {
        console.log("handleClose");
        setShow(false);
    };

    const handleSaveDate = () => {
        console.log("handleSaveDate");
        const dt = DateUtils.parseDate(editedDateString, editedTimeFormat);
        if (editingStartDateTime) {
            setPracticeStartTime(dt.getTime());
            console.log("AddPracticeSession.handleSaveDate - setting practiceStartTime to: " + dt.getTime());
            localStorage.setItem("practiceStartTime", dt.getTime() + "");
        } else {
            setPracticeEndTime(dt.getTime());
        }
        setShow(false);
    };

    const addRemoveSongSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
		let localSongList = [...selectedSongs];
		// does the current array contain this song?
        const incomingSong: Song = songs.find(s => s.songId === parseInt(event.target.value));
		const alreadySelected = localSongList.some(song => song.songId === incomingSong.songId);
        if (event.target.checked) {
			if (!alreadySelected) {
				console.log("Add song with ID: " + incomingSong.songId);
				localSongList.push(incomingSong);
				setSelectedSongs(localSongList);
                if (!editingExistingEntry) {
                    const songString = "(" + DateUtils.formatDateTime(new Date(), timeOnlyFormat) + ") " + incomingSong.songNm;
                    setNotes(s => s != null && s.trim() !== '' ? s + '\n' + songString : s + songString);
                }
			}
		} else {
			// the user unchecked the box, so if it exists in the list, remove it
			console.log("Remove song with ID: " + incomingSong.songId);
			if (alreadySelected) {
				localSongList = localSongList.filter(s => s.songId !== incomingSong.songId);
				setSelectedSongs(localSongList);
			}
		}
    };

    const handleSaveSong = async () => {
        setShowAddSong(false);
        setBusy({state: true, message: "Adding new song to the list..."});
        console.log("handleSaveSong");
        const saveSongResult: any = await practiceService.saveNewSong(songName);
        if (typeof saveSongResult.data === "string" && saveSongResult.data.startsWith("error")) {
            console.log("There was an error saving the song: " + saveSongResult.data)
        } else {
            const song: Song = {
                songId: parseInt(saveSongResult.data),
                songNm: songName
            };
            dispatch(stateActions.addSong(song));
            setBusy({state: false, message: ""});
        }
    };

    const handleSubmit = async () => {
        setBusy({state: true, message: "Saving current practice entry..."});
        const practiceEntry: PracticeEntry = {
            duration: duration,
            lessonContent: lessonContent,
            notes: notes,
            endDtTimeLong: practiceEndTime,
            practiceLocation: practiceLocation,
            endDtTimeStr: practiceEndTimeStr,
            startDtTimeLong: practiceStartTime,
            startDtTimeStr: practiceStartTimeStr,
			songsPracticed: selectedSongs.map(song => song.songId)
        };
        console.log("handleSubmit - Here is the practiceEntry: ", practiceEntry);
        const saveEntryResult: any = await practiceService.savePracticeEntry(practiceEntry);
        console.log("AddPracticeSession.handleSubmit - here is the response:");
        console.log(saveEntryResult.data);
        if (typeof saveEntryResult.data === "string" && saveEntryResult.data.startsWith("error")) {
            console.log("There was an error: " + saveEntryResult.data)
        } else {
            clearLocalStorageItems();
            dispatch(stateActions.addPracticeEntry(saveEntryResult.data));
            setBusy({state: false, message: ""});
            if (!editingExistingEntry) {
                navigate("/allEntries");
            }
        }
    };

    const clearLocalStorageItems = () => {
        const keys = ["notes", "practiceStartTime", "practiceEndTime", "selectedSongs", "lessonContent"];
        console.log("Clearing local storage for the following keys: ", keys);
        keys.forEach(key => localStorage.removeItem(key));
    };

    const handleNoPractice = async () => {
        setBusy({state: true, message: "Saving 'no practice'..."});
        const practiceEntry: PracticeEntry = {
            duration: 0,
            lessonContent: noPracticeReason,
            notes: noPracticeReason,
            endDtTimeLong: practiceStartTime,
            practiceLocation: "None",
            endDtTimeStr: practiceStartTimeStr,
            startDtTimeLong: practiceStartTime,
            startDtTimeStr: practiceStartTimeStr,
            songsPracticed: []
        };
        console.log("handleSubmit - Here is the practiceEntry: ", practiceEntry);
        const saveEntryResult: any = await practiceService.savePracticeEntry(practiceEntry);
        console.log("AddPracticeSession.handleSubmit - here is the response:");
        console.log(saveEntryResult.data);
        if (typeof saveEntryResult.data === "string" && saveEntryResult.data.startsWith("error")) {
            console.log("There was an error: " + saveEntryResult.data)
        } else {
            clearLocalStorageItems();
            dispatch(stateActions.addPracticeEntry(saveEntryResult.data));
            setBusy({state: false, message: ""});
            navigate("/allEntries");
        }

    };

    const handleNextPrev = (next: boolean) => {
        if (next) {
            handleEditCase(practiceEntries[nextEntryIndex]);
        } else {
            handleEditCase(practiceEntries[prevEntryIndex]);
        }
    };

    const getValidationMessages = () => {
        const locValidationReasons = [];
        if (!lessonContent || lessonContent.trim() === "") {
            locValidationReasons.push("You've not added a title.");
        }
        if (practiceEndTime === undefined) {
            locValidationReasons.push("The end date of the practice session has not been set.")
        }
        setSubmitValidationReasons(locValidationReasons);
        return locValidationReasons;
    }

    if (busy.state) {
        return <SpinnerTimer message={busy.message} />;
    } else {
        return (
            <Container className="mt-3">
                {practiceEntries && practiceEntries.length > 0 && currEntryIndex !== -1 && nextEntryIndex !== -1 && prevEntryIndex !== -1 &&
                    <NextPrevNavigationComponent onClick={() => handleNextPrev(false)}
                                                 currEntryIndex={currEntryIndex}
                                                 onClick1={() => handleNextPrev(true)}/>
                }
                <h3 className="mb-3">Add Practice Session</h3>
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label htmlFor="startDtTime">Start Time</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Text id="startDtTime" className="me-3">
                            {practiceStartTimeStr}
                        </Form.Text>
                        <Button className="me-3" size="sm"
                                onClick={() => setPracticeStartTime(new Date().getTime())}>Now</Button>
                        <Button className="me-3" size="sm" onClick={() => {
                            setEditingStartDateTime(true);
                            setShow(true);
                        }}>Enter Exact</Button>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label>Location</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Check
                            inline
                            label="Church"
                            name="location"
                            onChange={() => setPracticeLocation("Church")}
                            checked={practiceLocation === "Church"}
                            type="radio"
                            id="home"
                        />
                        <Form.Check
                            inline
                            label="Home"
                            name="location"
                            onChange={() => setPracticeLocation("Home")}
                            checked={practiceLocation === "Home"}
                            type="radio"
                            id="home"
                        />
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label>Lesson Content</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control value={lessonContent} placeholder="Lesson Content" onChange={handleLessonContent}>
                        </Form.Control>
                    </Col>
                </Row>
                {songs && songs.length > 0 &&
                    <Row className="mb-2">
                        <Col>
                            <Button variant={"outline-primary"} className="me-3" size="lg"
                                    onClick={() => setShowSongList(!showSongList)}>
                                <i className={showSongList ? "fa fa-toggle-up me-2" : "fa fa-toggle-down me-2"}/> {showSongList ? " Hide Song List" : " Show Song List"}
                            </Button>
                        </Col>
                    </Row>
                }
                {songs && songs.length > 0 && showSongList && songs.map(s =>
                    <Row key={s.songId} className="m-2 p-1 border border-info">
                        <Col>
                            <Form.Label>{s.songNm}</Form.Label>
                        </Col>
                        <Col>
                            <Form.Check
                                inline
                                value={s.songId}
                                onChange={addRemoveSongSelection}
                                checked={selectedSongs.some(song => song.songId === s.songId)}
                                type="checkbox"
                            />
                        </Col>
                    </Row>
                )}
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label>Notes</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control className="fs-1" as="textarea" rows={5} value={notes} placeholder="Notes"
                                      onChange={handleNotes}>
                        </Form.Control>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={10}>
                        <Button className="me-3" size="sm" onClick={handleShowAddSong}>Add Song</Button>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label htmlFor="endDtTime">End Time</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Text id="endDtTime" className="me-3">
                            {practiceEndTimeStr}
                        </Form.Text>
                        <Button className="me-3" size="sm"
                                onClick={() => setPracticeEndTime(new Date().getTime())}>Now</Button>
                        <Button className="me-3" size="sm" onClick={() => {
                            setEditingStartDateTime(false);
                            setShow(true);
                        }}>Enter Exact</Button>
                    </Col>
                </Row>
                {duration > -1 &&
                    <Row className="mb-2">
                        <Col lg={2}>
                            <Form.Label htmlFor="duration">Duration</Form.Label>
                        </Col>
                        <Col lg={10}>
                            <Form.Text id="duration">
                                {duration} minutes
                            </Form.Text>
                        </Col>
                    </Row>
                }
                <Row className="mb-2">
                    <Col lg={6}>
                        <Button className="me-3"
                                onClick={() => getValidationMessages().length > 0 ? setShowConfirm(true) : handleSubmit()}>Submit</Button>
                        <Button onClick={() => setShowReason(true)}>No Practice Today</Button>
                    </Col>
                </Row>
                <EditDateComponent show={show}
                                   onHide={handleClose}
                                   editingStartDateTime={editingStartDateTime}
                                   value={editedDateString}
                                   onChange={evt => setEditedDateString(evt.target.value)}
                                   onClick={handleSaveDate}/>
                <EnterNoPracticeReasonComponent show={showReason}
                                                onHide={() => setShowReason(false)}
                                                value={noPracticeReason}
                                                onChange={evt => setNoPracticeReason(evt.target.value)}
                                                onClick={handleNoPractice}/>
                <AddSongComponent show={showAddSong}
                                  onHide={() => {}}
                                  value={songName}
                                  onChange={evt => setSongName(evt.target.value)}
                                  onClick={() => {}}
                                  onClick1={handleSaveSong}/>
                <SubmitConfirmComponent show={showConfirm}
                                        onHide={() => {}}
                                        strings={submitValidationReasons}
                                        callbackfn={r => <li key={r}>{r}</li>}
                                        onClick={handleSubmit}
                                        onClick1={() => setShowConfirm(false)}/>
            </Container>
        );
    }
}
export default AddPracticeSession;