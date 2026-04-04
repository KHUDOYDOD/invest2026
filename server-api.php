<?php
/**
 * API для удаленного управления сервером через HTTP
 * Загрузите этот файл на сервер и вызывайте API для управления
 */

// Конфигурация
$CONFIG = [
    'secret_key' => 'X11021997x',  // Пароль для авторизации API
    'project_path' => '/home/root11/invest2026',
    'pm2_process' => 'investpro'
];

// Проверка авторизации
$auth_key = $_SERVER['HTTP_X_AUTH_KEY'] ?? $_GET['key'] ?? '';
if ($auth_key !== $CONFIG['secret_key']) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Получение команды
$action = $_GET['action'] ?? '';

header('Content-Type: application/json');

switch ($action) {
    case 'status':
        // Статус PM2
        exec("pm2 status {$CONFIG['pm2_process']} 2>&1", $output, $return_code);
        echo json_encode([
            'status' => 'ok',
            'output' => implode("\n", $output),
            'code' => $return_code
        ]);
        break;
        
    case 'restart':
        // Перезапуск приложения
        exec("cd {$CONFIG['project_path']} && pm2 restart {$CONFIG['pm2_process']} 2>&1", $output, $return_code);
        echo json_encode([
            'status' => 'ok',
            'action' => 'restart',
            'output' => implode("\n", $output),
            'code' => $return_code
        ]);
        break;
        
    case 'logs':
        // Получение логов
        $lines = intval($_GET['lines'] ?? 50);
        exec("pm2 logs {$CONFIG['pm2_process']} --lines {$lines} 2>&1", $output, $return_code);
        echo json_encode([
            'status' => 'ok',
            'logs' => implode("\n", $output)
        ]);
        break;
        
    case 'update_file':
        // Обновление файла (base64)
        $file_path = $_POST['path'] ?? '';
        $content = $_POST['content'] ?? '';
        
        if (!$file_path || !$content) {
            echo json_encode(['error' => 'Missing path or content']);
            exit;
        }
        
        $full_path = $CONFIG['project_path'] . '/' . $file_path;
        $decoded = base64_decode($content);
        
        if (file_put_contents($full_path, $decoded)) {
            echo json_encode(['status' => 'ok', 'file' => $file_path]);
        } else {
            echo json_encode(['error' => 'Failed to write file']);
        }
        break;
        
    case 'rebuild':
        // Пересборка проекта
        exec("cd {$CONFIG['project_path']} && npm run build 2>&1", $output, $return_code);
        echo json_encode([
            'status' => 'ok',
            'action' => 'rebuild',
            'output' => implode("\n", array_slice($output, -20)), // Последние 20 строк
            'code' => $return_code
        ]);
        break;
        
    default:
        echo json_encode([
            'error' => 'Unknown action',
            'available_actions' => ['status', 'restart', 'logs', 'update_file', 'rebuild']
        ]);
}
