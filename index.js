const checkTime = function() {
    // 現時刻の取得
    var nowDate = new Date();
    var nowHours = nowDate.getHours();
    var nowMinutes = nowDate.getMinutes();

    // 時間に変換
    var nowMtoH = 0;
    if(nowMinutes<30){
        nowMtoH = 0;
    }else{
        nowMtoH = 0.5;
    }
    var nowTtoH = String(nowHours + nowMtoH);
    console.log(nowHours+":"+nowMinutes);
    console.log(nowTtoH);

    // XMLHttpRequestオブジェクトの作成
    var request = new XMLHttpRequest();
    var URL = "https://script.google.com/macros/s/AKfycbwgabm961niluzXJkC-WEC05f__SxpqK_q0IeVyNI_yhnvLh6s/exec?time="+nowTtoH+"";
    request.open('GET', URL, true);
    request.responseType = 'json';

    // レスポンスが返ってきた時の処理を記述
    request.onload = function () {
        var arr = this.response;
        console.log(arr);
        var title = arr['task'].toString();
        Push.create(title, {
            body: '残り10分！！進捗はーーー？？',
            timeout: 8000, // 通知が消えるタイミング
            onClick: function() {
            // 通知がクリックされた場合の設定
            location.href='https://docs.google.com/spreadsheets/d/1lDxj0a44E8ASDH6hOVIXzfK8stUZXW2YVXqI206-djs/edit#gid=572962785';
            }
        });
    }

    if(nowMinutes == 20 || nowMinutes == 50){
        // リクエストをURLに送信
        request.send();
    }

}
window.onload = function() {
    Notification.requestPermission();
    setInterval(checkTime, 60000);
};