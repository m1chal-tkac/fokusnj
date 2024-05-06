<?php

function put()
{
  require_once __DIR__ . "/../../../../lib/validate.php";

  $validation = array(
    "email" => email(),
    "key" => text(40, 40),
    "heslo" => text(5, 30)
  );

  $data = validate($validation);

  require __DIR__ . "/../../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_uzivatel = "SELECT id, recovery_token FROM uzivatele WHERE email = ?";
  $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
  $stmt_uzivatel->bind_param("s", $data["email"]);
  $stmt_uzivatel->execute();
  $uzivatel = $stmt_uzivatel->get_result()->fetch_assoc();

  require_once __DIR__ . "/../../../../lib/response.php";

  if (isset($uzivatel["id"]) && isset($uzivatel["recovery_token"])) {
    $recovery_token = explode(" ", $uzivatel["recovery_token"]);
    if (date("Y-m-d H:i:s") > $recovery_token[0] . " " . $recovery_token[1]) {
      response(403, "Vyžádejte si nový email");
    } else if ($recovery_token[2] == $data["key"]) {
      $password = password_hash($data["heslo"], PASSWORD_BCRYPT);

      require __DIR__ . "/../../../../lib/db.php";

      $mysql->select_db("rezerv_sys");
      $sql_uzivatel = "UPDATE uzivatele SET login_valid=?, heslo=?, recovery_token=NULL WHERE email=?";
      $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
      $stmt_uzivatel->bind_param("sss", time(), $password, $data["email"]);
      $stmt_uzivatel->execute();

      require_once __DIR__ . "/../../../../lib/email.php";

      sendEmail($data["email"], "Změna hesla FokusNJ", "Vaše heslo účtu FokusNJ bylo změněno.");

      response(200, null);
    } else  response(403, "Vyžádejte si nový email");
  } else response(400, "Heslo se nepodařilo změnit");
}
