<?php
	$func = $_GET['func'];
	$voiceInput = $_GET['voiceInput'];
	$jsonFile = file_get_contents("videoData.json");
	$jsonDecode = json_decode($jsonFile,true);
	$json = $jsonDecode['data'];

	$result;

	$matchValue = 0;
	$matchCount = 0;

	if($func == "search"){
		$result = checkForMatchInJSON($json,$voiceInput);
		/* returns a JSON
		{
			"utterance": string,
			"youtubeId": string,
			matchPercentage: float
		}

		or "no match"
		*/
	}
	else if($func == "listUtterances"){
		$result = getUtteranceList($json);
		/* returns a JSON array
		[ "these", "are", "the", "stored", "utterances" ]
		*/
	}

	function checkForMatchInJSON($jsonData,$searchCriteria){
		foreach ($jsonData as $dataArray) {
			similar_text(strtolower($dataArray['utterance']),strtolower($searchCriteria),$p);
			if($p >= 75) { //check for at least 75% accuracy
				$arr = array("utterance"=>$dataArray['utterance'], "youtubeId"=>$dataArray['youtubeId'], "matchPercentage"=>$p, "startTime"=>$dataArray['youtubeTime']);
				return json_encode($arr);
			}
		}

		return "no match";
	}

	function getUtteranceList($jsonData){
		$arr = array();
		foreach ($jsonData as $dataArray){
			$arr[] = $dataArray['utterance'];
		}
		return json_encode($arr);
	}

	echo $result;
?>