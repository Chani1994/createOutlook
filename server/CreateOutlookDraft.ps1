param (
  [string]$to,
  [string]$subject,
  [string]$body,
  [string]$attachmentPath
)

$Outlook = New-Object -ComObject Outlook.Application
$Mail = $Outlook.CreateItem(0)
$Mail.To = $to
$Mail.Subject = $subject
$Mail.Body = $body

if (Test-Path $attachmentPath) {
    $Mail.Attachments.Add($attachmentPath)
}

$Mail.Display()
