<?php

function patch()
{
  require_once __DIR__ . "/../../../../lib/validate.php";

  $validation = array(
    "email" => email(),
  );

  $data = validate($validation);

  require __DIR__ . "/../../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_uzivatel = "SELECT id, recovery_token FROM uzivatele WHERE email = ?";
  $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
  $stmt_uzivatel->bind_param("s", $data["email"]);
  $stmt_uzivatel->execute();
  $uzivatel = $stmt_uzivatel->get_result()->fetch_assoc();

  if (isset($uzivatel["id"])) {
    if (isset($uzivatel["recovery_token"])) {
      $recovery_token = explode(" ", $uzivatel["recovery_token"]);
    }
    if (empty($uzivatel["recovery_token"]) || date("Y-m-d H:i:s") > $recovery_token[0] . " " . $recovery_token[1]) {
      $key = bin2hex(random_bytes(20));

      $recovery_token = date("Y-m-d H:i:s", strtotime("+1 hour")) . " " . $key;

      $mysql->select_db("rezerv_sys");
      $sql_uzivatel = "UPDATE uzivatele SET recovery_token=? WHERE email=?";
      $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
      $stmt_uzivatel->bind_param("ss", $recovery_token, $data["email"]);
      $stmt_uzivatel->execute();

      require_once  __DIR__ . "/../../../../lib/env.php";
      require_once __DIR__ . "/../../../../lib/email.php";

      sendEmail($data["email"], "Obnova hesla FokusNJ", "Vyžádali jste si změnu hesla vašeho uživatelského účtu.\n\nZměnu můžete provést zde: " . $_ENV["FRONTEND_SERVER"] . "/change-password?email=" . $data["email"] . "&key=" . $key . "\n\nPokud si myslíte, že jste si změnu nevyžádali, můžete tento email ignorovat.");
    }
  }

  sleep(5);

  require_once __DIR__ . "/../../../../lib/response.php";

  response(200, null);
}
