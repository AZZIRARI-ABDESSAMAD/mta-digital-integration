<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
if (!$user) {
    echo "No user found.\n";
    exit;
}
$request = Illuminate\Http\Request::create("/api/user/progress", "GET", ["type" => "stagiaire"]);
$request->setUserResolver(function () use ($user) { return $user; });
$controller = new App\Http\Controllers\API\ProgressController();
$response = $controller->getUserProgress($request);
echo "ONBOARDING STEP: " . $user->onboarding_step . "\n";
echo json_encode($response->getData(true)["formations"], JSON_PRETTY_PRINT);
