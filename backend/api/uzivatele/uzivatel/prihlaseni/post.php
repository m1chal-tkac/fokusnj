<?php

function post()
{
  require_once __DIR__ . "/../../../../lib/validate.php";

  $validation = array(
    "email" => email(),
    "heslo" => text(5, 30),
  );

  $data = validate($validation);

  require_once __DIR__ . "/../../../../lib/login.php";

  $token = prihlaseni($data["email"], $data["heslo"]);

  require_once __DIR__ . "/../../../../lib/response.php";

  sleep(5);

  if (empty($token)) response(400, "Špatné heslo nebo email");

  response(200, array("token" => $token));
}
