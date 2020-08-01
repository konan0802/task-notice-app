var CLIENT_ID = "1019878572459-n2qs7sppubh652o2gqr92iilc0s7craq.apps.googleusercontent.com";
var API_KEY = "pzLBT5nf7_LZkCeDgd4aylGl";
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
var scriptId = "1KqjZp0CHSjdVnFS1_0oPtcczrma5LOQJCv6yFBuyzOIpR9d4pR85Tov6";
var DISCOVERY_DOCS = ["https://script.googleapis.com/$discovery/rest?version=v1"]; // そのまま

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

// 勝手に実行される
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  // GoogleAPIのinitialize
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES.join(' ')
  }).then(function () {
    // ログインしているかをupdateSigninStatusに渡す
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    // ボタンが押された時の処理を代入。
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    // ログイン済み
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    // APIを叩く
    callAppsScript("helloWebAPI", ["World!"], function(resp) {
      // コールバック関数
      if (resp.error) {
        // エラーあり
        if (resp.error.status) {
          console.log('Error calling API: ' + JSON.stringify(resp, null, 2));
        } else {
          var error = resp.error.details[0];
          console.log('Script error! Message: ' + error.errorMessage);
        }
      } else {
        // エラーなし
        appendPre(resp.response.result);
      }
    });
  } else {
    // ログインしていない
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

// ログインボタンが押された時
function handleAuthClick(event) {
  // ログインの処理
  gapi.auth2.getAuthInstance().signIn();
}

// ログアウトボタンが押された時
function handleSignoutClick(event) {
  //　ログアウトの処理。
  gapi.auth2.getAuthInstance().signOut();
}

// 画面に出力する
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

// APIを叩く関数
function callAppsScript(functionName, parameters, callbackFunc) {
  var request = { 'function': functionName, 'parameters': parameters };
  var op = gapi.client.request({
    'root': 'https://script.googleapis.com',
    'path': 'v1/scripts/' + scriptId + ':run',
    'method': 'POST',
    'body': request
  });
  // APIを叩いてコールバック関数を呼ぶ
  op.execute(callbackFunc);
}