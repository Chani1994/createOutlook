param (
  [string]$to,
  [string]$subject,
  [string]$body,
  [string]$attachmentPath,
  [string]$attachmentName
)

$Outlook = New-Object -ComObject Outlook.Application
$Mail = $Outlook.CreateItem(0)
$Mail.To = $to
$Mail.Subject = $subject
$Mail.Body = $body

if (Test-Path $attachmentPath) {
    if ($attachmentName -and ($attachmentName -ne (Split-Path $attachmentPath -Leaf))) {
        $newPath = Join-Path (Split-Path $attachmentPath -Parent) $attachmentName
        Rename-Item -Path $attachmentPath -NewName $attachmentName -Force
        $attachmentPath = $newPath
    }

    $Mail.Attachments.Add($attachmentPath)
}

$Mail.Display()
