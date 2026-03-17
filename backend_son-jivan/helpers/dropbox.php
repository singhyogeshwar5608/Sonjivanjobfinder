<?php
require_once __DIR__ . '/../config/config.php';

function uploadToDropbox($filePath, $fileName)
{
    $accessToken = DROPBOX_ACCESS_TOKEN;
    $uploadFolder = DROPBOX_UPLOAD_FOLDER;
    
    $dropboxPath = $uploadFolder . '/' . $fileName;
    
    $fileContent = file_get_contents($filePath);
    if ($fileContent === false) {
        error_log('Failed to read file for Dropbox upload: ' . $filePath);
        return null;
    }
    
    $endpoint = 'https://content.dropboxapi.com/2/files/upload';
    
    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/octet-stream',
        'Dropbox-API-Arg: ' . json_encode([
            'path' => $dropboxPath,
            'mode' => 'add',
            'autorename' => true,
            'mute' => false
        ])
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fileContent);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Some shared hosting environments lack CA bundles; disable peer verification to avoid SSL errors.
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    
    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($response === false || $statusCode >= 400) {
        error_log('Dropbox upload failed: ' . ($curlError ?: $response));
        return null;
    }
    
    $data = json_decode($response, true);
    
    // Create a shared link for the uploaded file
    $sharedLink = createDropboxSharedLink($data['path_display']);
    
    return $sharedLink ?: $data['path_display'];
}

function createDropboxSharedLink($path)
{
    $accessToken = DROPBOX_ACCESS_TOKEN;
    
    $endpoint = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';
    
    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json'
    ];
    
    $payload = json_encode([
        'path' => $path,
        'settings' => [
            'requested_visibility' => 'public'
        ]
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    
    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($response === false || $statusCode >= 400) {
        // Try to get existing shared link
        return getExistingDropboxSharedLink($path);
    }
    
    $data = json_decode($response, true);
    
    if (isset($data['url'])) {
        // Convert to direct download link
        return str_replace('?dl=0', '?dl=1', $data['url']);
    }
    
    return null;
}

function getExistingDropboxSharedLink($path)
{
    $accessToken = DROPBOX_ACCESS_TOKEN;
    
    $endpoint = 'https://api.dropboxapi.com/2/sharing/list_shared_links';
    
    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json'
    ];
    
    $payload = json_encode([
        'path' => $path,
        'direct_only' => true
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    
    if (isset($data['links']) && count($data['links']) > 0) {
        // Convert to direct download link
        return str_replace('?dl=0', '?dl=1', $data['links'][0]['url']);
    }
    
    return null;
}
