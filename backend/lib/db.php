<?php
require_once __DIR__ . '/env.php';

$servername = $_ENV['MYSQL_SERVER'];
$username = $_ENV['MYSQL_USER'];
$mysql_password = $_ENV['MYSQL_PASSWORD'];

// Create a connection
$mysql = new mysqli($servername, $username, $mysql_password);
