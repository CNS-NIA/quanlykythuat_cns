# Fix HTML files
Get-ChildItem *.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    
    # Fix all HTML links
    $content = $content -replace 'href="([^#"/][^":]*\.html)"', 'href="/$1"'
    
    # Fix CSS/JS links
    $content = $content -replace 'href="style\.css"', 'href="/style.css"'
    $content = $content -replace 'src="(script|vehicles)\.js"', 'src="/$1.js"'
    
    Set-Content $_.FullName $content -Encoding UTF8
    Write-Host "? ау s?a: $($_.Name)"
}
