<?php

function get()
{
  require_once __DIR__ . "/../../lib/login.php";

  $user = getUser();

  require_once __DIR__ . "/../../lib/response.php";

  if (empty($user) || $user["admin"] != "1") response(401, "Nedostatečná práva");

  require __DIR__ . "/../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $uzivatele = $mysql->query("SELECT email, jmeno, prijmeni, admin FROM uzivatele")->fetch_all(MYSQLI_ASSOC);

  response(200, array(
    "uzivatele" => $uzivatele
  ));
}
