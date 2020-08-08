<?php
//タイムゾーンの指定
date_default_timezone_set("Asia/Tokyo");
//現時刻取得(h, m)
$nowHour = date('H');
$nowMinute = date('i');
var_dump(date('H:i'));
//分を時間に変換2値化
if($nowMinute<30){
  $nowMinute = 0;
}else{
    $nowMinute = 0.5;
}
//現時刻(h)取得
$nowTime = (String)($nowHour+$nowMinute);
var_dump($nowTime);

//API実行、HTTPリクエスト
var_dump("access to GAS");
try{
  $url = "https://script.google.com/macros/s/AKfycbwgabm961niluzXJkC-WEC05f__SxpqK_q0IeVyNI_yhnvLh6s/exec?time=".$nowTime."";
  $json = file_get_contents($url);
  $json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
  $arr = json_decode($json,true);
  var_dump($arr);

}catch ( Exception $ex ) {
  var_dump("No access to GAS");
}

echo <<<EOM
<script src="https://cdnjs.cloudflare.com/ajax/libs/push.js/0.0.11/push.min.js"></script>
<script type="text/javascript">
  var arr = {$json};
  var title = arr['task'].toString();
  Push.create(title, {
    body: '残り10分！！進捗はーーー？？',
    timeout: 8000, // 通知が消えるタイミング
    onClick: function() {
      // 通知がクリックされた場合の設定
      location.href='https://docs.google.com/spreadsheets/d/1lDxj0a44E8ASDH6hOVIXzfK8stUZXW2YVXqI206-djs/edit#gid=572962785';
    }
  });
</script>
EOM;
