# Deploy updated component to VPS with password authentication
$password = "$X11021997x$" | ConvertTo-SecureString -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential("root11", $password)

# Use Posh-SSH for deployment (if available)
$server = "213.171.31.215"
$localPath = "C:\Users\x4539\Downloads\Invest2025-main\Invest2025-main\.next"
$remotePath = "/home/root11/invest2026/.next"

try {
    # Import Posh-SSH if available
    Import-Module Posh-SSH -ErrorAction Stop
    
    # Create SSH session
    $session = New-SSHSession -ComputerName $server -Credential $credential -AcceptKey
    
    # Copy files
    Set-SCPItem -ComputerName $server -Credential $credential -Path $localPath -Destination $remotePath -Force
    
    # Restart application
    Invoke-SSHCommand -SessionId $session.SessionId -Command "cd /home/root11/invest2026 && pm2 restart investpro"
    
    # Close session
    Remove-SSHSession -SessionId $session.SessionId
    
    Write-Host "✅ Deployment complete!"
} catch {
    Write-Host "⚠️  Posh-SSH not available. Trying alternative method..."
    
    # Use plink (PuTTY) if available
    $plink = Get-Command "plink.exe" -ErrorAction SilentlyContinue
    if ($plink) {
        Write-Host "Using PuTTY plink for deployment..."
        # This would require manual setup
    }
    
    Write-Host "❌ Please install Posh-SSH: Install-Module Posh-SSH -Force"
    Write-Host "Or manually copy the .next folder using WinSCP"
}
