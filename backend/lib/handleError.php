<?php

require_once __DIR__ . "/login.php";

$user = getUser();

require_once __DIR__ . "/response.php";

if (isset($user) && $user["spravce_systemu"] == "1") response(500, $e->getMessage());
else response(500, "Chyba serveru");
