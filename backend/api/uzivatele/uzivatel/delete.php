<?php

function delete()
{
  require_once __DIR__ . "/../../../lib/login.php";

  $user = getUser();

  require_once __DIR__ . "/../../../lib/response.php";

  if (empty($user) || $user["admin"] != "1") response(401, "Nedostatečná práva");

  require_once __DIR__ . "/../../../lib/validate.php";

  $validation = array(
    "email" => email(),
    "heslo" => text(5, 30),
  );

  $data = validate($validation);

  if (!checkPassword($user["email"], $data["heslo"])) response(403, "Špatné heslo");

  require __DIR__ . "/../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_uzivatel = "DELETE FROM uzivatele WHERE email = ?";
  $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
  $stmt_uzivatel->bind_param("s", $data["email"]);
  $stmt_uzivatel->execute();

  response(200, null);
}
