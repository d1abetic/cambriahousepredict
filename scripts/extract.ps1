Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\own\Desktop\Cambria Prediction Webpage\public\images\predictbg-chained-clean.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$outDir = "c:\Users\own\Desktop\Cambria Prediction Webpage\public\images\chained"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

Write-Output "Image size: $($bmp.Width) x $($bmp.Height)"

# Let's inspect the bounding box of left column and right column
# In 1024x572:
# Left column is approximately X: 20 to 130
# Right column is approximately X: 894 to 1004

# Let's crop individual banners:
# Left column has 4 banners: Warwick, Montblanc, Dover, Eyras
# Right column has 4 banners: Thornhill, Bloodstone, Armagnac, Blackfort

# Let's crop a column strip of left and right to inspect:
$cropRectLeft = [System.Drawing.Rectangle]::FromLTRB(15, 0, 135, 572)
$leftStrip = $bmp.Clone($cropRectLeft, $bmp.PixelFormat)
$leftStrip.Save("$outDir\left_strip.png", [System.Drawing.Imaging.ImageFormat]::Png)
$leftStrip.Dispose()

$cropRectRight = [System.Drawing.Rectangle]::FromLTRB(889, 0, 1009, 572)
$rightStrip = $bmp.Clone($cropRectRight, $bmp.PixelFormat)
$rightStrip.Save("$outDir\right_strip.png", [System.Drawing.Imaging.ImageFormat]::Png)
$rightStrip.Dispose()

Write-Output "Saved left_strip.png and right_strip.png"
$bmp.Dispose()
