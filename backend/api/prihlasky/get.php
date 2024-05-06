<?php

function get()
{
  require_once __DIR__ . "/../../lib/login.php";

  $user = getUser();

  require_once __DIR__ . "/../../lib/response.php";

  if (empty($user)) response(401, "Nedostatečná práva");

  require_once __DIR__ . "/../../lib/validate.php";

  $data = validate(array("url" => text(13, 13)));

  require __DIR__ . "/../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_soutez = "SELECT id, nazev, prihlasovani_od, prihlasovani_do FROM souteze WHERE url = ?";
  $stmt_soutez = $mysql->prepare($sql_soutez);
  $stmt_soutez->bind_param("s", $data["url"]);
  $stmt_soutez->execute();
  $soutez = $stmt_soutez->get_result()->fetch_assoc();

  if (empty($soutez["id"])) response(400, "Soutěž není dostupná");

  $sql_prihlasky_select = "`" . $soutez["id"] . "_soutez`.id, ucitel_email, ucitel_telefon, soutezici_skolni_kolo, `" . $soutez["id"] . "_studenti`.jmeno, prijmeni, datum_narozeni, trida, rezerv_sys.skoly.nazev \"skola_nazev\"";

  $mysql->select_db("rezerv_sys");
  $sql_pridavne_pole = "SELECT id, nazev, kategorie, typ FROM pridavne_pole WHERE id_souteze = ?";
  $stmt_pridavne_pole = $mysql->prepare($sql_pridavne_pole);
  $stmt_pridavne_pole->bind_param("i", $soutez["id"]);
  $stmt_pridavne_pole->execute();
  $pridavne_pole = $stmt_pridavne_pole->get_result()->fetch_all(MYSQLI_ASSOC);

  $pridavne_pole_skola = array();
  $pridavne_pole_student = array();

  foreach ($pridavne_pole as $key => $value) {
    if ($value["kategorie"] == "SKOLA") {
      $sql_prihlasky_select .= ", `" . $soutez["id"] . "_soutez`.`" . $value["id"] . "` \"skola_" . $value["id"] . "\"";
      $pridavne_pole_skola[$value["id"]] = array("nazev" => $value["nazev"], "typ" => $value["typ"]);
    } else {
      $sql_prihlasky_select .= ", `" . $soutez["id"] . "_studenti`.`" . $value["id"] . "` \"student_" . $value["id"] . "\"";
      $pridavne_pole_student[$value["id"]] = array("nazev" => $value["nazev"], "typ" => $value["typ"]);
    }
  }

  $sql_prihlasky_select .= " ";

  $mysql->select_db("souteze");
  $sql_prihlasky = "SELECT " . $sql_prihlasky_select . "FROM `" . $soutez["id"] . "_soutez` INNER JOIN `" . $soutez["id"] . "_studenti` ON `" . $soutez["id"] . "_soutez`.id = id_prihlasky INNER JOIN rezerv_sys.skoly ON skola = rezerv_sys.skoly.id";
  $prihlasky = $mysql->query($sql_prihlasky)->fetch_all(MYSQLI_ASSOC);

  $id = "";
  $i = -1;

  $data_prihlasky = array();

  foreach ($prihlasky as $key => $value) {
    if ($id != $value["id"]) {
      $i++;
      $data_prihlasky[$i] = array(
        "skola" => $value["skola_nazev"],
        "ucitel_email" => $value["ucitel_email"],
        "ucitel_telefon" => $value["ucitel_telefon"],
        "soutezici_skolni_kolo" => $value["soutezici_skolni_kolo"],
      );
      foreach ($pridavne_pole_skola as $key_ => $value_) {
        $data_prihlasky[$i][$key_] = $value["skola_" . $key_];
      }
      $data_prihlasky[$i]["studenti"] = array();
      $id = $value["id"];
    }
    $data_student = array(
      "jmeno" => $value["jmeno"],
      "prijmeni" => $value["prijmeni"],
      "datum_narozeni" => $value["datum_narozeni"],
      "trida" => $value["trida"]
    );
    foreach ($pridavne_pole_student as $key_ => $value_) {
      $data_student[$key_] = $value["student_" . $key_];
    }
    array_push($data_prihlasky[$i]["studenti"], $data_student);
  }

  response(200, array(
    "nazev" => $soutez["nazev"],
    "prihlasovani_od" => $soutez["prihlasovani_od"],
    "prihlasovani_do" => $soutez["prihlasovani_do"],
    "pridavne_pole" => array(
      "skola" => count($pridavne_pole_skola) > 0 ? $pridavne_pole_skola : new stdClass,
      "student" => count($pridavne_pole_student) > 0 ? $pridavne_pole_student : new stdClass
    ),
    "prihlasky" => $data_prihlasky
  ));
}
