<?php
  switch($_POST['action']){
      case 'sendEmail':
          echo json_encode(sendEmail($_POST['data']));
      break;
      
      default:
      break;
  }

  function sendEmail($data){
    $username = clearData($data['username']); 
    $phone_number = clearData($data['phone_number']);
    $call_time = clearData($data['call_time']);
      $to      = 'mail@yandex.ru';
      $fromMail = 'notify@'.$_SERVER['SERVER_NAME'];
      $fromName = 'WebSite.ru';
      $date = date(DATE_RFC2822);
      $subject = 'Форма обратной связи WebSite.ru';
      $subject = '=?utf-8?b?'. base64_encode($subject) .'?=';
      $message = "<html>Заявка с сайта WebSite"."<br><br>".
      "Имя пользователя: <b>".$username."</b><br>".
      "Телефон: <b>".$phone_number."</b><br>".
      "Удобное время звонка: <b>".$call_time."</b></html>";
      $messageId='<'.time().'-'.md5($fromMail.$to).'@'.$_SERVER['SERVER_NAME'].'>';
      $headers  = 'MIME-Version: 1.0' . "\r\n";
      $headers .= "Content-type: text/html; charset=utf-8". "\r\n";
      $headers .= "From: ". $fromName ." <". $fromMail ."> \r\n";
      $headers .= "Date: ". $date ." \r\n";
      $headers .= "Message-ID: ". $messageId ." \r\n";

      $arr = array(
        'Имя пользователя: ' => $username,
        'Телефон: ' => $phone_number,
        'Удобное время звонка:' => $call_time
      );

      foreach($arr as $key => $value) {
        $txt .= "".$key." <b>".$value."</b>"."%0A";
      };

      $token = "telegram_token";

      $chat_id = "chat_id";

      $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

       if(mail($to, $subject, $message, $headers)){
          return true;
      } else {
          return false;
      }
  }

function clearData($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = preg_replace('/[^A-Za-z0-9\-]/', '', $data);
    return $data;
}

?>