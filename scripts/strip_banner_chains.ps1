# Removes the baked-in pixel chain stubs from the chained house banners so the
# vector steel chain (public/images/chained/steel_chain.svg) can run behind them.
# Keeps the top mounting brackets (rows 13-14) and mirrors them onto the bottom
# edge so each banner hangs from the chain at both ends.
# Output: public/images/chained/banners/<house>.png (originals are left untouched)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$srcDir = Join-Path $root 'public\images\chained'
$outDir = Join-Path $srcDir 'banners'
New-Item -ItemType Directory -Force $outDir | Out-Null

$houses = 'armagnac', 'blackfort', 'bloodstone', 'dover', 'eyras', 'montblanc', 'thornhill', 'warwick'
$frameTop = 15      # first row of the banner frame
$frameBottom = 126  # last row of the banner frame
$bracketRows = 13, 14
$transparent = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)

foreach ($house in $houses) {
  $src = [System.Drawing.Bitmap]::FromFile((Join-Path $srcDir "$house.png"))
  $bmp = New-Object System.Drawing.Bitmap $src
  $src.Dispose()

  # Capture bracket pixels before clearing anything
  $bracket = @{}
  foreach ($y in $bracketRows) {
    for ($x = 0; $x -lt $bmp.Width; $x++) { $bracket["$x,$y"] = $bmp.GetPixel($x, $y) }
  }

  # Clear everything outside the frame (chain stubs above and below)
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    if ($y -ge $frameTop -and $y -le $frameBottom) { continue }
    for ($x = 0; $x -lt $bmp.Width; $x++) { $bmp.SetPixel($x, $y, $transparent) }
  }

  # Restore the top brackets and mirror them below the frame
  foreach ($y in $bracketRows) {
    $mirrorY = $frameBottom + ($frameTop - $y)
    for ($x = 0; $x -lt $bmp.Width; $x++) {
      $c = $bracket["$x,$y"]
      $bmp.SetPixel($x, $y, $c)
      $bmp.SetPixel($x, $mirrorY, $c)
    }
  }

  $bmp.Save((Join-Path $outDir "$house.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Saved banners/$house.png"
}
