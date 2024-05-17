<?php

function get()
{
  require_once __DIR__ . "/../../../lib/validate.php";

  $data = validate(array(
    "take" => cislo(0, 1000) . optional(),
  ));
  if (empty($data["take"])) $data["take"] = 20;

  require_once __DIR__ . "/../../../lib/login.php";

  $user = getUser();

  require_once __DIR__ . "/../../../lib/response.php";

  if (empty($user)) response(401, "Nedostatečná práva");

  require __DIR__ . "/../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_souteze = "SELECT url, nazev, pocet_prihlasek, prihlasovani_od, prihlasovani_do FROM souteze ORDER BY id DESC LIMIT ?";
  $stmt_souteze = $mysql->prepare($sql_souteze);
  $stmt_souteze->bind_param("i", $data["take"]);
  $stmt_souteze->execute();
  $souteze = $stmt_souteze->get_result()->fetch_all(MYSQLI_ASSOC);

  response(200, array(
    "souteze" => $souteze
  ));
}
