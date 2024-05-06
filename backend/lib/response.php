<?php

function response($code, $payload)
{
  http_response_code($code);

  if ($code >= 200 && $code < 300) {
    $response = array(
      "status" => "success",
      "data" => $payload
    );

    echo json_encode($response);
  }
  if ($code >= 400 && $code < 500) {
    $response = array(
      "status" => "error",
      "message" => $payload
    );

    echo json_encode($response);
    die();
  }
  if ($code >= 500 && $code < 600) {
    $response = array(
      "status" => "server error",
      "message" => $payload
    );

    echo json_encode($response);
    sleep(5);
    die();
  }
}
