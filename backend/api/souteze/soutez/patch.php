<?php

function patch()
{
  require_once __DIR__ . "/../../../lib/login.php";

  $user = getUser();

  require_once __DIR__ . "/../../../lib/response.php";

  if (empty($user)) response(401, "Nedostatečná práva");

  require_once __DIR__ . "/../../../lib/validate.php";

  $data = validate(array("url" => text(13, 13)));

  require __DIR__ . "/../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_soutez = "SELECT id FROM souteze WHERE url = ?";
  $stmt_soutez = $mysql->prepare($sql_soutez);
  $stmt_soutez->bind_param("s", $data["url"]);
  $stmt_soutez->execute();
  $soutez = $stmt_soutez->get_result()->fetch_assoc();

  if (empty($soutez["id"])) response(400, "Soutěž není dostupná");

  $validation = array(
    "url" => text(13, 13),
    "nazev" => text(1, 50) . optional(),
    "prihlasovani_od" => datum() . optional(),
    "prihlasovani_do" => datum() . optional(),
  );

  $data = validate($validation);

  $update_soutez = "";
  $bind_soutez = "";
  $value_soutez = array();

  if (isset($data["nazev"])) {
    $update_soutez .= "nazev=?, ";
    $bind_soutez .= "s";
    array_push($value_soutez, $data["nazev"]);
  }

  if (isset($data["prihlasovani_od"])) {
    $date = explode(".", str_replace(" ", "", $data["prihlasovani_od"]));
    $update_soutez .= "prihlasovani_od=?, ";
    $bind_soutez .= "s";
    array_push($value_soutez, $date[2] . "-" . $date[1] . "-" . $date[0]);
  }

  if (isset($data["prihlasovani_do"])) {
    $date = explode(".", str_replace(" ", "", $data["prihlasovani_do"]));
    $update_soutez .= "prihlasovani_do=?, ";
    $bind_soutez .= "s";
    array_push($value_soutez, $date[2] . "-" . $date[1] . "-" . $date[0]);
  }

  $bind_soutez .= "s";
  array_push($value_soutez, $data["url"]);

  if (count($value_soutez) > 1) {
    $update_soutez = substr($update_soutez, 0, -2);

    $mysql->select_db("rezerv_sys");
    $sql_soutez = "UPDATE souteze SET " . $update_soutez . " WHERE url=?";
    $stmt_soutez = $mysql->prepare($sql_soutez);
    $stmt_soutez->bind_param($bind_soutez, ...$value_soutez);
    $stmt_soutez->execute();
  }

  response(200, null);
}
