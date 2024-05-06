<?php

function is_assoc($array)
{
  return array_values($array) !== $array;
}

function cislo($min, $max)
{
  return "CISLO " . $min . " " . $max;
}

function text($min, $max)
{
  if ($min == $max) {
    return "/^.{" . $min . "}$/";
  }
  return "/^.{" . $min . "," . $max . "}$/";
}

function email()
{
  return "/^\\S+@\\S+\\.\\S+$/";
}

function telefon()
{
  return "/^[1-9][0-9]{8}$/";
}

function datum()
{
  return "/^(0?[1-9]|[1-2][0-9]|3[0-1])\\.\\s?(0?[1-9]|1[0-2])\\.\\s?[0-9]{4}$/";
}

function optional()
{
  return "OPTIONAL";
}

function validate($schema)
{
  require_once __DIR__ . "/../lib/response.php";

  try {
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') $data = $_GET;

    validate_helper($schema, $data, "");

    return $data;
  } catch (Throwable $e) {
    throw new Exception($e->getMessage());
  }
}

function validate_helper($schema, $object, $path)
{
  error_reporting(0);
  foreach ($schema as $key => $value) {
    if (empty($object[$key]) && !is_array($object[$key]) && !str_ends_with($value, "OPTIONAL")) response(400, "Špatný formát parametru " . $path . $key);
    if (is_array($schema[$key]) && is_assoc($schema[$key])) {
      validate_helper($schema[$key], $object[$key], $path . $key . "/");
    } else if (is_array($schema[$key])) {
      foreach ($object[$key] as $key_ => $value_) {
        validate_helper($schema[$key][0], $value_, $path . $key . "/" . $key_ + 1 . "/");
      }
    } else {
      if (isset($object[$key])) {
        if (str_ends_with($value, "OPTIONAL")) $value = explode("OPTIONAL", $value)[0];

        if (str_starts_with($value, "CISLO")) {
          $minMax = explode(" ", $value);
          if ($object[$key] < $minMax[1] || $object[$key] > $minMax[2] || floor($object[$key]) != $object[$key]) response(400, "Špatný formát parametru " . $path . $key);
        } else if (!preg_match($value, $object[$key])) response(400, "Špatný formát parametru " . $path . $key);

        if ($value == datum()) {
          $object[$key] = str_replace(" ", "", $object[$key]);
          $date = explode(".", $object[$key]);

          if (!checkdate($date[1], $date[0], $date[2])) response(400, "Špatný formát parametru " . $path . $key);
        }
      }
    }
  }
  error_reporting(E_ALL);
}
