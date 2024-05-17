<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../../../../../lib/env.php";
if ($_ENV["ACCESS_CONTROL_ALLOW"] === "1") {
  header("Access-Control-Allow-Origin: " . $_ENV["ACCESS_CONTROL"]);
  header("Access-Control-Allow-Headers: Authorization");
  header("Access-Control-Allow-Methods: PATCH, PUT");
}

try {
  if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    require __DIR__ . "/patch.php";
    patch();
  } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    require __DIR__ . "/put.php";
    put();
  }
} catch (Throwable $e) {
  require __DIR__ . "/../../../../../lib/handleError.php";
}
