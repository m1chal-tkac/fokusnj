<?php

function post()
{
  require_once __DIR__ . "/../../../lib/login.php";

  $user = getUser();

  require_once __DIR__ . "/../../../lib/response.php";

  if (empty($user)) response(401, "Nedostatečná práva");

  require_once __DIR__ . "/../../../lib/validate.php";

  $validation = array(
    "nazev" => text(1, 50),
    "prihlasovani_od" => datum(),
    "prihlasovani_do" => datum(),
    "pridavne_pole" => array(
      array(
        "nazev" => text(1, 50),
        "kategorie" => "/^(SKOLA|STUDENT)$/",
        "typ" => "/^(CISLO|TEXT)$/"
      )
    )
  );

  $data = validate($validation);

  try {
    require __DIR__ . "/../../../lib/db.php";

    $mysql->begin_transaction();

    $url = uniqid();

    $po = explode(".", str_replace(" ", "", $data["prihlasovani_od"]));
    $prihlasovani_od = $po[2] . "-" . $po[1] . "-" . $po[0];

    $pd = explode(".", str_replace(" ", "", $data["prihlasovani_do"]));
    $prihlasovani_do = $pd[2] . "-" . $pd[1] . "-" . $pd[0];

    $mysql->select_db("rezerv_sys");
    $sql_soutez = "INSERT souteze (url, nazev, prihlasovani_od, prihlasovani_do) VALUE (?, ?, ?, ?)";
    $stmt_soutez = $mysql->prepare($sql_soutez);
    $stmt_soutez->bind_param("ssss", $url, $data["nazev"], $prihlasovani_od, $prihlasovani_do);
    $stmt_soutez->execute();

    $id_souteze = $mysql->insert_id;

    $pridavne_pole_skola = array();
    $pridavne_pole_student = array();

    foreach ($data["pridavne_pole"] as $key => $value) {
      $mysql->select_db("rezerv_sys");
      $sql_pridavne_pole = "INSERT pridavne_pole (id_souteze, kategorie, nazev, typ) VALUE (?, ?, ?, ?)";
      $stmt_pridavne_pole = $mysql->prepare($sql_pridavne_pole);
      $stmt_pridavne_pole->bind_param("isss", $id_souteze, $value["kategorie"], $value["nazev"], $value["typ"]);
      $stmt_pridavne_pole->execute();
      $id_pridavne_pole = $mysql->insert_id;

      if ($value["kategorie"] == "SKOLA") {
        $pridavne_pole_skola[$id_pridavne_pole] = array("nazev" => $value["nazev"], "typ" => $value["typ"]);
      } else {
        $pridavne_pole_student[$id_pridavne_pole] = array("nazev" => $value["nazev"], "typ" => $value["typ"]);
      }
    }

    $sql_create_soutez = "CREATE TABLE `" . $id_souteze . "_soutez`(id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, skola INT UNSIGNED NOT NULL, soutezici_skolni_kolo TINYINT UNSIGNED NOT NULL, ucitel_email VARCHAR(50) NOT NULL, ucitel_telefon CHAR(9) NOT NULL";

    foreach ($pridavne_pole_skola as $key => $value) {
      $sql_create_soutez .= ", `" . $key . "`";
      if ($value["typ"] == "CISLO") {
        $sql_create_soutez .= " INT";
      } else {
        $sql_create_soutez .= " VARCHAR(50)";
      }
      $sql_create_soutez .= " NOT NULL";
    }

    $sql_create_soutez .= ", FOREIGN KEY (skola) REFERENCES rezerv_sys.skoly(id))";

    $mysql->select_db("souteze");
    $mysql->query($sql_create_soutez);

    $sql_create_studenti = "CREATE TABLE `" . $id_souteze . "_studenti`(id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, id_prihlasky INT UNSIGNED NOT NULL, jmeno VARCHAR(20) NOT NULL, prijmeni VARCHAR(20) NOT NULL, datum_narozeni DATE NOT NULL, trida VARCHAR(10) NOT NULL";

    foreach ($pridavne_pole_student as $key => $value) {
      $sql_create_studenti .= ", `" . $key . "`";
      if ($value["typ"] == "CISLO") {
        $sql_create_studenti .= " INT";
      } else {
        $sql_create_studenti .= " VARCHAR(50)";
      }
      $sql_create_studenti .= " NOT NULL";
    }

    $sql_create_studenti .= ", FOREIGN KEY (id_prihlasky) REFERENCES souteze.`" . $id_souteze . "_soutez`(id))";

    $mysql->select_db("souteze");
    $mysql->query($sql_create_studenti);

    $mysql->commit();

    response(200, array("url" => $url));
  } catch (Throwable $e) {
    $mysql->rollback();
    throw new Exception($e->getMessage());
  }
}
