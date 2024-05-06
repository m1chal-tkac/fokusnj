<?php

function put()
{
  require_once __DIR__ . "/../../../lib/validate.php";

  $validation = array(
    "email" => email(),
    "jmeno" => text(2, 20),
    "prijmeni" => text(2, 20),
    "heslo" => text(5, 30),
    "key" => text(40, 40)
  );

  $data = validate($validation);

  require __DIR__ . "/../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_uzivatel = "SELECT create_token FROM uzivatele WHERE email = ?";
  $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
  $stmt_uzivatel->bind_param("s", $data["email"]);
  $stmt_uzivatel->execute();
  $uzivatel = $stmt_uzivatel->get_result()->fetch_assoc();

  require_once __DIR__ . "/../../../lib/response.php";

  if (!isset($uzivatel["create_token"])) response(400, "Účet nelze založit");

  $create_token = explode(" ", $uzivatel["create_token"]);
  if (date("Y-m-d H:i:s") > $create_token[0] . " " . $create_token[1]) {
    response(403, "Vyžádejte si nový email");
  }

  if ($create_token[2] != $data["key"]) response(403, "Vyžádejte si nový email");

  $heslo = password_hash($data["heslo"], PASSWORD_BCRYPT);

  $mysql->select_db("rezerv_sys");
  $sql_uzivatel = "UPDATE uzivatele SET jmeno=?, prijmeni=?, heslo=?, create_token=NULL WHERE email=?";
  $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
  $stmt_uzivatel->bind_param("ssss", $data["jmeno"], $data["prijmeni"], $heslo, $data["email"]);
  $stmt_uzivatel->execute();

  response(200, null);
}
