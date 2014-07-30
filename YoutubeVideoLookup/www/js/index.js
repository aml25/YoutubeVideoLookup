/*
** Licensed to the Apache Software Foundation (ASF) under one
** or more contributor license agreements.  See the NOTICE file
** distributed with this work for additional information
** regarding copyright ownership.  The ASF licenses this file
** to you under the Apache License, Version 2.0 (the
** "License"); you may not use this file except in compliance
** with the License.  You may obtain a copy of the License at
**
** http://www.apache.org/licenses/LICENSE-2.0
**
** Unless required by applicable law or agreed to in writing,
** software distributed under the License is distributed on an
** "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
** KIND, either express or implied.  See the License for the
** specific language governing permissions and limitations
** under the License.
*/

var youtubeLoaded = false;

function onDeviceReady(){
    console.log("Device is ready");
}

function recognizeSpeech() {
    var maxMatches = 5;
    var promptString = "Speak now"; // optional
    var language = "en-US";                     // optional
    window.plugins.speechrecognizer.startRecognize(function(result){
        handleSpeechResult(result);
    }, function(errorMessage){
        console.log("Error message: " + errorMessage);
    }, maxMatches, promptString, language);
}

function handleSpeechResult(speechResults){
    var resultsLength = speechResults.length;
    var counter = 0;
    for(var i=0;i<resultsLength;i++){
        var speech = speechResults[i];
        console.log("recognizer got: " + speech);

        showLoading();

        counter++;

        $.ajax({
            url: "http://wired-freehold-656.appspot.com",
            type: "GET",
            data: { func: "search", voiceInput: speech }
        })
        .done(function(data){

            console.log("counter = "  + counter);
            if(data != "no match"){
                data = JSON.parse(data);
                console.log(data);
                var url = 'http://www.youtube.com/watch?v='+data['youtubeId']+'&t='+data['startTime'];

                console.log("opening: " + url);
                if(!youtubeLoaded){ //this is to prevent multiple video loads
                    youtubeLoaded = true;
                    window.location = url; //go to the Youtube app rather than playing the video here
                }
                
                if(counter == resultsLength && !youtubeLoaded){ //no results
                    hideLoading();
                }
            }
            else{
                console.log("no match");
            }
        });
    }
}

function fillUtteranceList(){
    var $utterances = $("#utterances");
    $.ajax({
        url: "http://wired-freehold-656.appspot.com",
        type: "GET",
        data: { func: "listUtterances" }
    })
    .done(function(data){
        data = JSON.parse(data);
        data.forEach(function(utterance){
            $utterances.append("<p>\""+utterance+"\"</p>");
        });

        $utterances.fadeIn();
    });
}

function showLoading(){
    $("#loadingContainer").fadeIn();
    $(".voiceInput").fadeTo(240,0.25);
    $("#utterances").fadeTo(240,0.25);
    $("h1").fadeTo(240,0.25);
}

function hideLoading(){
    $("#loadingContainer").fadeOut();
    $(".voiceInput").fadeTo(240,1);
    $("#utterances").fadeTo(240,1);
    $("h1").fadeTo(240,1);
}

function initialize(){
    document.addEventListener("deviceready", onDeviceReady, true);

    $(".voiceInput img").click(function(){
        recognizeSpeech();
    });

    fillUtteranceList();

    document.addEventListener("resume", function(){
        console.log("resumed");
        youtubeLoaded = false; //we just came back to the app (presumably from Youtube) so clear the boolean
        setTimeout(function(){
            hideLoading();
        },3000);
       
    }, false);
    
}

