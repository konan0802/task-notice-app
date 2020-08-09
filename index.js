// グローバル変数
// 以前通知したタスクの時間を保持
let previousMinutes = "";

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

    // GASにGETリクエスト
    var request = new XMLHttpRequest();
    var URL = "https://script.google.com/macros/s/AKfycbwgabm961niluzXJkC-WEC05f__SxpqK_q0IeVyNI_yhnvLh6s/exec?time="+nowTtoH+"";
    request.open('GET', URL, true);
    request.responseType = 'json';

    // レスポンスが返ってきた時の処理を記述
    request.onload = function () {
        // タスクの取り出し
        var arr = this.response;
        var datetime = arr['datetime'].toString();
        var title = arr['task'].toString();
        // 以前通知したタスクの時間 ⇒ 既に通知されたタスクは通知しない
        if(datetime!=previousMinutes){
            // 通知を作成
            Push.create(title, {
                body: '残り10分！！進捗はーーー？？',
                timeout: 8000, // 通知が消えるタイミング
                onClick: function() {
                // 通知がクリックされた場合の設定
                location.href='https://docs.google.com/spreadsheets/d/1lDxj0a44E8ASDH6hOVIXzfK8stUZXW2YVXqI206-djs/edit#gid=572962785';
                }
            });
            previousMinutes = datetime;
        }
    }
    //20分と50分の際にリクエスト送信
    if(nowMinutes == 20 || nowMinutes == 50){
        // リクエストをURLに送信
        request.send();
    }
}
//リロードされた際に
window.onload = function() {
    // 権限の確認
    Notification.requestPermission();
    // 30秒毎に実行
    setInterval(checkTime, 30000);
};