Add-Type -AssemblyName System.Drawing

$left = [System.Drawing.Bitmap]::FromFile("c:\Users\own\Desktop\Cambria Prediction Webpage\public\images\chained\left_strip.png")

# Each banner has a gold/ornate top and bottom border.
# The strip height is 572.
# Let's crop 4 equal or precise segments:
# Let's test segment height: 572 / 4 = 143.
# Let's crop 4 banners of height 143 from left:
$outDir = "c:\Users\own\Desktop\Cambria Prediction Webpage\public\images\chained"

$namesLeft = @("warwick", "montblanc", "dover", "eyras")
for ($i = 0; $i -lt 4; $i++) {
    $y = $i * 143
    $rect = [System.Drawing.Rectangle]::FromLTRB(0, $y, $left.Width, [Math]::Min($y + 143, $left.Height))
    $sub = $left.Clone($rect, $left.PixelFormat)
    $sub.Save("$outDir\$($namesLeft[$i]).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $sub.Dispose()
}

$right = [System.Drawing.Bitmap]::FromFile("c:\Users\own\Desktop\Cambria Prediction Webpage\public\images\chained\right_strip.png")
$namesRight = @("thornhill", "bloodstone", "armagnac", "blackfort")
for ($i = 0; $i -lt 4; $i++) {
    $y = $i * 143
    $rect = [System.Drawing.Rectangle]::FromLTRB(0, $y, $right.Width, [Math]::Min($y + 143, $right.Height))
    $sub = $right.Clone($rect, $right.PixelFormat)
    $sub.Save("$outDir\$($namesRight[$i]).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $sub.Dispose()
}

$left.Dispose()
$right.Dispose()
Write-Output "Extracted 8 banner segments!"
