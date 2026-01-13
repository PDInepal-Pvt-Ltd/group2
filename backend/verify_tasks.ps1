$response = Invoke-RestMethod -Uri http://127.0.0.1:8000/api/users/login/ -Method Post -ContentType "application/json" -InFile login.json
$token = $response.access
$headers = @{ Authorization = "Bearer $token" }

# Verify My Tasks
$tasks = Invoke-RestMethod -Uri http://127.0.0.1:8000/api/tasks/my-tasks/ -Method Get -Headers $headers
Write-Host "Tasks Response: "
$tasks | ConvertTo-Json -Depth 5
