<?php

function get()
{
  require_once __DIR__ . "/../../../../lib/validate.php";

  $data = validate(array("url" => text(13, 13)));

  require __DIR__ . "/../../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_soutez = "SELECT id, url, nazev, prihlasovani_od, prihlasovani_do FROM souteze WHERE url = ?";
  $stmt_soutez = $mysql->prepare($sql_soutez);
  $stmt_soutez->bind_param("s", $data["url"]);
  $stmt_soutez->execute();
  $soutez = $stmt_soutez->get_result()->fetch_assoc();

  require_once __DIR__ . "/../../../../lib/response.php";

  if (empty($soutez["id"]) || date("Y-m-d") < $soutez["prihlasovani_od"] || date("Y-m-d") > $soutez["prihlasovani_do"]) response(400, "Soutěž není dostupná");

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
      $pridavne_pole_skola[$value["id"]] = array("nazev" => $value["nazev"], "typ" => $value["typ"]);
    } else {
      $pridavne_pole_student[$value["id"]] = array("nazev" => $value["nazev"], "typ" => $value["typ"]);
    }
  }

  $mysql->select_db("rezerv_sys");
  $sql_skoly = "SELECT id, nazev FROM skoly";
  $skoly = $mysql->query($sql_skoly)->fetch_all(MYSQLI_ASSOC);

  require_once __DIR__ . "/../../../../lib/response.php";

  response(200, array(
    "nazev" => $soutez["nazev"],
    "pridavne_pole" => array(
      "skola" => count($pridavne_pole_skola) > 0 ? $pridavne_pole_skola : new stdClass,
      "student" => count($pridavne_pole_student) > 0 ? $pridavne_pole_student : new stdClass
    ),
    "skoly" => $skoly
  ));
}
