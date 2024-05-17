<?php

function delete()
{
  require_once __DIR__ . "/../../../../lib/login.php";

  $user = getUser();

  require_once __DIR__ . "/../../../../lib/response.php";

  if (empty($user)) response(401, "Nedostatečná práva");

  require_once __DIR__ . "/../../../../lib/validate.php";

  $validation = array(
    "url" => text(13, 13),
    "heslo" => text(5, 30)
  );

  $data = validate($validation);

  require __DIR__ . "/../../../../lib/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_soutez = "SELECT id FROM souteze WHERE url = ?";
  $stmt_soutez = $mysql->prepare($sql_soutez);
  $stmt_soutez->bind_param("s", $data["url"]);
  $stmt_soutez->execute();
  $soutez = $stmt_soutez->get_result()->fetch_assoc();

  if (empty($soutez["id"])) response(400, "Soutěž není dostupná");

  if (!checkPassword($user["email"], $data["heslo"])) response(403, "Špatné heslo");

  try {
    $mysql->begin_transaction();

    $mysql->select_db("rezerv_sys");
    $sql_pridavne_pole = "DELETE FROM pridavne_pole WHERE id_souteze = ?";
    $stmt_pridavne_pole = $mysql->prepare($sql_pridavne_pole);
    $stmt_pridavne_pole->bind_param("i", $soutez["id"]);
    $stmt_pridavne_pole->execute();

    $mysql->select_db("rezerv_sys");
    $sql_soutez = "DELETE FROM souteze WHERE id = ?";
    $stmt_soutez = $mysql->prepare($sql_soutez);
    $stmt_soutez->bind_param("i", $soutez["id"]);
    $stmt_soutez->execute();

    $mysql->select_db("souteze");
    $mysql->query("DROP TABLE `" . $soutez["id"] . "_studenti`");

    $mysql->select_db("souteze");
    $mysql->query("DROP TABLE `" . $soutez["id"] . "_soutez`");

    $mysql->commit();

    response(200, null);
  } catch (Throwable $e) {
    $mysql->rollback();
    throw new Exception($e->getMessage());
  }
}
