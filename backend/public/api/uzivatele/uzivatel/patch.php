<?php

function patch()
{
  require_once __DIR__ . "/../../../../lib/login.php";

  $user = getUser();

  require_once __DIR__ . "/../../../../lib/response.php";

  if (empty($user)) response(401, "Nedostatečná práva");

  require_once __DIR__ . "/../../../../lib/validate.php";

  $validation = array(
    "email" => email() . optional(),
    "jmeno" => text(2, 20) . optional(),
    "prijmeni" => text(2, 20) . optional(),
    "nove_heslo" => text(5, 30) . optional(),
    "heslo" => text(5, 30)
  );

  $data = validate($validation);

  if (!checkPassword($user["email"], $data["heslo"])) response(403, "Špatné heslo");

  $update_uzivatel = "login_valid=?, ";
  $bind_uzivatel = "s";
  $value_uzivatel = array(time());

  if (isset($data["email"])) {
    require __DIR__ . "/../../../../lib/db.php";

    $mysql->select_db("rezerv_sys");
    $sql_uzivatel = "SELECT id FROM uzivatele WHERE email = ?";
    $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
    $stmt_uzivatel->bind_param("s", $data["email"]);
    $stmt_uzivatel->execute();
    $uzivatel = $stmt_uzivatel->get_result()->fetch_assoc();

    if (isset($uzivatel["id"])) response(400, "Email už používá někdo jiný");

    $update_uzivatel .= "email=?, ";
    $bind_uzivatel .= "s";
    array_push($value_uzivatel, $data["email"]);
  }

  if (isset($data["jmeno"])) {
    $update_uzivatel .= "jmeno=?, ";
    $bind_uzivatel .= "s";
    array_push($value_uzivatel, $data["jmeno"]);
  }

  if (isset($data["prijmeni"])) {
    $update_uzivatel .= "prijmeni=?, ";
    $bind_uzivatel .= "s";
    array_push($value_uzivatel, $data["prijmeni"]);
  }

  if (isset($data["nove_heslo"])) {
    if ($data["nove_heslo"] == $data["heslo"]) response(400, "Nové heslo nesmí být stejné");

    $update_uzivatel .= "heslo=?, ";
    $bind_uzivatel .= "s";
    array_push($value_uzivatel, password_hash($data["nove_heslo"], PASSWORD_BCRYPT));
  }

  $bind_uzivatel .= "s";
  array_push($value_uzivatel, $user["email"]);

  if (count($value_uzivatel) > 1) {
    $update_uzivatel = substr($update_uzivatel, 0, -2);

    require __DIR__ . "/../../../../lib/db.php";

    $mysql->select_db("rezerv_sys");
    $sql_uzivatel = "UPDATE uzivatele SET " . $update_uzivatel . " WHERE email=?";
    $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
    $stmt_uzivatel->bind_param($bind_uzivatel, ...$value_uzivatel);
    $stmt_uzivatel->execute();
  }

  require_once __DIR__ . "/../../../../lib/email.php";

  sendEmail($user["email"], "Úprava účtu FokusNJ", "Úspěšně proběhla změna vašeho účtu FokusNJ.\n\nPokud jste úpravy neprovedli vy, změňte si prosím co nejdříve heslo.");

  response(200, null);
}
