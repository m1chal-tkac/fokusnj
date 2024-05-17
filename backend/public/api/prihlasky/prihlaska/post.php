<?php

function post()
{
  require_once __DIR__ . "/../../../../lib/validate.php";

  $data = validate(array("url" => text(13, 13)));

  require __DIR__ . "/../../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_soutez = "SELECT id, nazev, pocet_prihlasek, prihlasovani_od, prihlasovani_do FROM souteze WHERE url = ?";
  $stmt_soutez = $mysql->prepare($sql_soutez);
  $stmt_soutez->bind_param("s", $data["url"]);
  $stmt_soutez->execute();
  $soutez = $stmt_soutez->get_result()->fetch_assoc();

  require_once __DIR__ . "/../../../../lib/response.php";

  if (empty($soutez["id"]) || date("Y-m-d") < $soutez["prihlasovani_od"] || date("Y-m-d") > $soutez["prihlasovani_do"]) response(400, "Soutěž není dostupná");

  $validation = array(
    "url" => text(13, 13),
    "skola" => cislo(1, 250),
    "ucitel_email" => email(),
    "ucitel_telefon" => telefon(),
    "soutezici_skolni_kolo" => cislo(1, 99),
    "studenti" => array(
      array(
        "jmeno" => text(2, 20),
        "prijmeni" => text(2, 20),
        "datum_narozeni" => datum(),
        "trida" => text(1, 10)
      )
    ),
  );

  $mysql->select_db("rezerv_sys");
  $sql_pridavne_pole = "SELECT id, nazev, kategorie, typ FROM pridavne_pole WHERE id_souteze = ?";
  $stmt_pridavne_pole = $mysql->prepare($sql_pridavne_pole);
  $stmt_pridavne_pole->bind_param("i", $soutez["id"]);
  $stmt_pridavne_pole->execute();
  $pridavne_pole = $stmt_pridavne_pole->get_result()->fetch_all(MYSQLI_ASSOC);

  $pridavne_pole_skola = array();
  $pridavne_pole_student = array();

  foreach ($pridavne_pole as $key => $value) {
    $regex = text(1, 50);
    if ($value["typ"] == "CISLO") {
      $regex = cislo(-1000000, 1000000);
    }

    if ($value["kategorie"] == "SKOLA") {
      $validation[$value["id"]] = $regex;
      $pridavne_pole_skola[$value["id"]] = array("nazev" => $value["nazev"], "typ" => $value["typ"]);
    } else {
      $validation["studenti"][0][$value["id"]] = $regex;
      $pridavne_pole_student[$value["id"]] = array("nazev" => $value["nazev"], "typ" => $value["typ"]);
    }
  }

  $data = validate($validation);

  $mysql->select_db("rezerv_sys");
  $sql_skola = "SELECT id FROM skoly WHERE id = ?";
  $stmt_skola = $mysql->prepare($sql_skola);
  $stmt_skola->bind_param("i", $data["skola"]);
  $stmt_skola->execute();
  $skola = $stmt_skola->get_result()->fetch_assoc();

  if (empty($skola["id"])) response(400, "Špatné jméno školy");

  try {
    $mysql->begin_transaction();

    $insert_skola = "skola, ucitel_email, ucitel_telefon, soutezici_skolni_kolo";
    $bind_skola = "issi";
    $value_sql_skola = "(?, ?, ?, ?";
    $value_skola = array($skola["id"], $data["ucitel_email"], $data["ucitel_telefon"], $data["soutezici_skolni_kolo"]);

    foreach ($pridavne_pole_skola as $key => $value) {
      $insert_skola .= ", `" . $key . "`";
      $value_sql_skola .= ", ?";
      array_push($value_skola, $data[$key]);
      if ($value["typ"] == "CISLO") {
        $bind_skola .= "i";
      } else {
        $bind_skola .= "s";
      }
    }

    $value_sql_skola .= ")";

    $mysql->select_db("souteze");
    $sql_prihlaska = "INSERT `" . $soutez["id"] . "_soutez`(" . $insert_skola . ") VALUE" . $value_sql_skola;
    $stmt_prihlaska = $mysql->prepare($sql_prihlaska);
    $stmt_prihlaska->bind_param($bind_skola, ...$value_skola);
    $stmt_prihlaska->execute();

    $id_prihlasky = $mysql->insert_id;

    foreach ($data["studenti"] as $key => $value) {
      $date = explode(".", str_replace(" ", "", $value["datum_narozeni"]));

      $insert_student = "id_prihlasky, jmeno, prijmeni, datum_narozeni, trida";
      $bind_student = "issss";
      $value_sql_student = "(?, ?, ?, ?, ?";
      $value_student = array($id_prihlasky, $value["jmeno"], $value["prijmeni"], $date[2] . "-" . $date[1] . "-" . $date[0], $value["trida"]);

      foreach ($pridavne_pole_student as $key_ => $value_) {
        $insert_student .= ", `" . $key_ . "`";
        $value_sql_student .= ", ?";
        array_push($value_student, $value[$key_]);
        if ($value_["typ"] == "CISLO") {
          $bind_student .= "i";
        } else {
          $bind_student .= "s";
        }
      }

      $value_sql_student .= ")";

      $mysql->select_db("souteze");
      $sql_student = "INSERT `" . $soutez["id"] . "_studenti`(" . $insert_student . ") VALUE" . $value_sql_student;
      $stmt_student = $mysql->prepare($sql_student);
      $stmt_student->bind_param($bind_student, ...$value_student);
      $stmt_student->execute();
    }

    $mysql->select_db("rezerv_sys");
    $sql_pocet = "UPDATE souteze SET pocet_prihlasek = " . $soutez["pocet_prihlasek"] + count($data["studenti"]) . " WHERE id = ?";
    $stmt_pocet = $mysql->prepare($sql_pocet);
    $stmt_pocet->bind_param("i", $soutez["id"]);
    $stmt_pocet->execute();

    require_once __DIR__ . "/../../../../lib/email.php";

    sendEmail($data["ucitel_email"], 'Nová přihláška FokusNJ', 'Úspěšně byla vytvořena nová přihláška pro soutěž ' . $soutez["nazev"]);

    $mysql->commit();
    response(200, null);
  } catch (Throwable $e) {
    $mysql->rollback();
    throw new Exception($e->getMessage());
  }
}
