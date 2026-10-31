param(
  [Parameter(Mandatory = $true)][string]$Name,
  [Parameter(Mandatory = $true)][int]$Age,
  [Parameter(Mandatory = $true)][string]$Email
)

$securePassword = Read-Host "Enter a new password for $Email (input is hidden)" -AsSecureString
$passwordPointer = [IntPtr]::Zero

try {
  $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
  $env:BOOTSTRAP_USER_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
  $env:BOOTSTRAP_USER_NAME = $Name
  $env:BOOTSTRAP_USER_AGE = $Age.ToString()
  $env:BOOTSTRAP_USER_EMAIL = $Email

  node scripts/create-user.js
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
} finally {
  if ($passwordPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
  }
  $securePassword.Dispose()
  Remove-Item Env:BOOTSTRAP_USER_PASSWORD -ErrorAction SilentlyContinue
  Remove-Item Env:BOOTSTRAP_USER_NAME -ErrorAction SilentlyContinue
  Remove-Item Env:BOOTSTRAP_USER_AGE -ErrorAction SilentlyContinue
  Remove-Item Env:BOOTSTRAP_USER_EMAIL -ErrorAction SilentlyContinue
}
