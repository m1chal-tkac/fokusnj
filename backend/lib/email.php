<?php
require __DIR__ . "/../vendor/autoload.php";

function sendEmail($email, $header, $text)
{

  $resend = Resend::client($_ENV["SMTP_PASSWORD"]);

  $resend->emails->send([
    "from" => "Rezervační systém FokusNJ <" . $_ENV["SMTP_EMAIL"] . ">",
    "to" => [$email],
    "subject" => $header,
    "text" => $text,
  ]);
}
