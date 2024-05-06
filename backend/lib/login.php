<?php
require __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function checkPassword($email, $password)
{
  require __DIR__ . "/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_uzivatel = "SELECT heslo FROM uzivatele WHERE email = ?";
  $stmt_soutez = $mysql->prepare($sql_uzivatel);
  $stmt_soutez->bind_param("s", $email);
  $stmt_soutez->execute();
  $uzivatel = $stmt_soutez->get_result()->fetch_assoc();

  if (isset($uzivatel["heslo"]) && password_verify($password, $uzivatel["heslo"])) return true;
  return false;
}

function prihlaseni($email, $password)
{
  require __DIR__ . "/db.php";

  $mysql->select_db("rezerv_sys");
  $sql_uzivatel = "SELECT jmeno, prijmeni, heslo, admin, spravce_systemu FROM uzivatele WHERE email = ?";
  $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
  $stmt_uzivatel->bind_param("s", $email);
  $stmt_uzivatel->execute();
  $uzivatel = $stmt_uzivatel->get_result()->fetch_assoc();

  if (isset($uzivatel["heslo"]) && password_verify($password, $uzivatel["heslo"])) {

    require_once __DIR__ . "/env.php";

    $token_data = array(
      "email" => $email,
      "jmeno" => $uzivatel["jmeno"],
      "prijmeni" => $uzivatel["prijmeni"],
      "admin" => $uzivatel["admin"],
      "spravce_systemu" => $uzivatel["spravce_systemu"],
      "iat" => time(),
      "exp" => time() + 7200
    );

    $jwt_key = $_ENV['JWT_SECRET'];
    $jwt_token = JWT::encode($token_data, $jwt_key, "HS256");

    return $jwt_token;
  } else {
    return null;
  }
}

function getUser()
{
  if (empty($_SERVER["HTTP_AUTHORIZATION"])) {
    return null;
  }

  $token = explode(" ", $_SERVER["HTTP_AUTHORIZATION"])[1];

  if (empty($token)) {
    return null;
  }

  require_once __DIR__ . "/env.php";

  try {
    $jwt_key = $_ENV['JWT_SECRET'];
    $data = JWT::decode($token, new Key($jwt_key, "HS256"));

    $data = (array) $data;

    require __DIR__ . "/db.php";

    $mysql->select_db("rezerv_sys");
    $sql_uzivatel = "SELECT login_valid FROM uzivatele WHERE email = ?";
    $stmt_uzivatel = $mysql->prepare($sql_uzivatel);
    $stmt_uzivatel->bind_param("s", $data["email"]);
    $stmt_uzivatel->execute();
    $uzivatel = $stmt_uzivatel->get_result()->fetch_assoc();

    if (empty($uzivatel["login_valid"])) throw new Exception();

    if ($uzivatel["login_valid"] > $data["iat"]) throw new Exception();
  } catch (Throwable $e) {
    return null;
  }

  return $data;
}
