<?php

function post()
{
  require_once __DIR__ . "/../../../../lib/login.php";

  $user = getUser();

  require_once __DIR__ . "/../../../../lib/response.php";

  if (empty($user) || $user["admin"] != "1") response(401, "Nedostatečná práva");

  require_once __DIR__ . "/../../../../lib/validate.php";

  $validation = array(
    "email" => email(),
    "admin" => cislo(0, 1) . optional(),
    "heslo" => text(5, 30),
  );

  $data = validate($validation);

  if (!isset($data["admin"])) $data["admin"] = 0;

  if (!checkPassword($user["email"], $data["heslo"])) response(403, "Špatné heslo");

  require __DIR__ . "/../../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_uzivatel = "SELECT id FROM uzivatele WHERE email = ?";
  $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
  $stmt_uzivatel->bind_param("s", $data["email"]);
  $stmt_uzivatel->execute();
  $uzivatel = $stmt_uzivatel->get_result()->fetch_assoc();

  if (isset($uzivatel["id"])) response(400, "Uživatel s tímto emailem již existuje");

  $key = bin2hex(random_bytes(20));

  $create_token = date("Y-m-d H:i:s", strtotime("+1 day")) . " " . $key;

  $mysql->select_db("rezerv_sys");
  $sql_uzivatel = "INSERT uzivatele(email, admin, create_token, jmeno, prijmeni) VALUE(?, ?, ?, \"Neznámé\", \"Neznámé\")";
  $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
  $stmt_uzivatel->bind_param("sis", $data["email"], $data["admin"], $create_token);
  $stmt_uzivatel->execute();

  require_once  __DIR__ . "/../../../../lib/env.php";
  require_once __DIR__ . "/../../../../lib/email.php";

  sendEmail($data["email"], "Nový účet FokusNJ", "Byli jste pozváni do systému soutěží FokusNJ.\n\nSvůj účet můžete založit zde: " . $_ENV["FRONTEND_SERVER"] . "/create-account?email=" . $data["email"] . "&key=" . $key . "\n\nPokud si myslíte, že se jedná o chybu, můžete tento email ignorovat.");

  response(200, null);
}
