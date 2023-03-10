
import * as AWS from 'aws-sdk';
import { LexRuntimeV2} from "@aws-sdk/client-lex-runtime-v2";

const Lexruntime = new LexRuntimeV2({ 
  apiVersion: '2020-08-07',
  region: "ap-southeast-1",      // Set your Bot Region
  credentials: new AWS.Credentials({
    accessKeyId: "",
    secretAccessKey: ""
  })     
});

var sessionAttributes = {};


const pushChat =  function () {
  // if there is text to be sent...
  var wisdomText = document.getElementById('wisdom');
  if (wisdomText && wisdomText.value && wisdomText.value.trim().length > 0) {

    // disable input to show we're sending it
    var wisdom = wisdomText.value.trim();
    wisdomText.value = '...';
    wisdomText.locked = true;
    // send it to the Lex runtime
    var params = {
      botAliasId: 'TSTALIASID',
      botId: 'JMMBDEUBM5',
      inputText: wisdom,
      localeId:'en_US'
    };
    showRequest(wisdom);
    // Promises.
    Lexruntime
      .recognizeText(params,function(err,data){
        if(data){
          console.log(data);
          sessionAttributes = data.sessionAttributes;
          // show response and/or error/dialog status
          showResponse(data);
        }else{
          console.log(err,err.stack)
        }
      
      });
      
        wisdomText.value = '';
        wisdomText.locked = false;
    
  }
  // we always cancel form submission
  return false;
}

function showRequest(daText) {

  var conversationDiv = document.getElementById('conversation');
  var requestPara = document.createElement("P");
  requestPara.className = 'userRequest';
  requestPara.appendChild(document.createTextNode(daText));
  conversationDiv.appendChild(requestPara);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showError(daText) {

  var conversationDiv = document.getElementById('conversation');
  var errorPara = document.createElement("P");
  errorPara.className = 'lexError';
  errorPara.appendChild(document.createTextNode(daText));
  conversationDiv.appendChild(errorPara);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showResponse(lexResponse) {

  var conversationDiv = document.getElementById('conversation');
  var responsePara = document.createElement("P");
  responsePara.className = 'lexResponse';
  if (lexResponse.message) {
    responsePara.appendChild(document.createTextNode(lexResponse.message));
    responsePara.appendChild(document.createElement('br'));
  }
  if (lexResponse.dialogState === 'ReadyForFulfillment') {
    responsePara.appendChild(document.createTextNode(
      'Ready for fulfillment'));
    // TODO:  show slot values
  } else {
    responsePara.appendChild(document.createTextNode(
      '(' + lexResponse.dialogState + ')'));
  }
  conversationDiv.appendChild(responsePara);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}


window.pushChat = pushChat;
