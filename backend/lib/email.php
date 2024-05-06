<?php
require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

function sendEmail($email, $header, $text)
{
  $mail = new PHPMailer(true);

  require_once __DIR__ . "/env.php";

  $mail->CharSet = "UTF-8";
  $mail->Encoding = 'base64';

  $mail->isSMTP();
  $mail->Host       = $_ENV['SMTP_SERVER'];
  $mail->Port       = $_ENV['SMTP_PORT'];
  $mail->Username   = $_ENV['SMTP_USER'];
  $mail->Password   = $_ENV['SMTP_PASSWORD'];

  if ($_ENV['SMTP_SECURE'] == "1") {
    $mail->SMTPAuth   = true;
    $mail->SMTPSecure = "ssl";
  }

  $mail->setFrom($_ENV['SMTP_USER'], 'Rezervační systém FokusNJ');
  $mail->addAddress($email);

  $mail->Subject = $header;
  $mail->Body    = $text;

  $mail->send();
}
