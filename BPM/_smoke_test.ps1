$ErrorActionPreference = 'Stop'
$base = "http://localhost:8888"
$pass = 0; $fail = 0; $results = @()

function Test($name, $cond) {
    if($cond) { $script:pass++; $script:results += "  [PASS] $name" }
    else { $script:fail++; $script:results += "  [FAIL] $name" }
}

# ═══════════════════════════════════════════════════════
#  SMOKE TEST 1: index.html
# ═══════════════════════════════════════════════════════
$r1 = Invoke-WebRequest -Uri "$base/index.html" -UseBasicParsing -TimeoutSec 10
$b1 = $r1.Content
$results += ""
$results += "==========================================="
$results += "  SMOKE TEST 1: index.html"
$results += "  HTTP=$($r1.StatusCode) SIZE=$($r1.RawContentLength)"
$results += "==========================================="

Test "DOCTYPE html"             ($b1 -match '<!DOCTYPE html>')
Test "lang=pt-BR"               ($b1 -match 'lang="pt-BR"')
Test "viewport no-scale"        ($b1 -match 'user-scalable=no')
Test "PWA manifest link"        ($b1 -match 'bpm-manifest\.json')
Test "Page title"               ($b1 -match 'apollo::bpm')
Test "Space Mono font"          ($b1 -match 'Space\+Mono')
Test "Intro overlay"            ($b1 -match 'id="intro"')
Test "SVG music icon"           ($b1 -match 'intro-icon')
Test "Intro label text"         ($b1 -match 'apollo::bpm verificador')
Test "INICIAR button"           ($b1 -match 'INICIAR')
Test "Boot loader div"          ($b1 -match 'id="boot"')
Test "7 boot bars"              (([regex]::Matches($b1, 'class="boot-bar"')).Count -eq 7)
Test "barPulse keyframes"       ($b1 -match '@keyframes barPulse')
Test "Boot step element"        ($b1 -match 'id="bootStep"')
Test "Security badge"           ($b1 -match 'sec-badge')
Test "Service Worker register"  ($b1 -match 'serviceWorker')
Test "file:// protocol check"   ($b1 -match "location\.protocol.*'file:'")
Test "Redirect to bpm-meter"    ($b1 -match 'bpm-meter\.html')
Test "Frame busting"            ($b1 -match 'window\.top.*window\.self')
Test "5 boot messages"          (([regex]::Matches($b1, "msg:")).Count -eq 5)
Test "use strict"               ($b1 -match "'use strict'")
Test "Transition: intro.out"    ($b1 -match "classList\.add\('out'\)")

$s1pass = $pass; $s1fail = $fail
$results += "  --- $s1pass PASS / $s1fail FAIL ---"

# ═══════════════════════════════════════════════════════
#  SMOKE TEST 2: bpm-meter.html
# ═══════════════════════════════════════════════════════
$pass = 0; $fail = 0
$r2 = Invoke-WebRequest -Uri "$base/bpm-meter.html" -UseBasicParsing -TimeoutSec 10
$b2 = $r2.Content
$results += ""
$results += "==========================================="
$results += "  SMOKE TEST 2: bpm-meter.html"
$results += "  HTTP=$($r2.StatusCode) SIZE=$($r2.RawContentLength)"
$results += "==========================================="

Test "DOCTYPE html"             ($b2 -match '<!DOCTYPE html>')
Test "lang=pt-BR"               ($b2 -match 'lang="pt-BR"')
Test "viewport no-scale"        ($b2 -match 'user-scalable=no')
Test "apple-mobile-web-app"     ($b2 -match 'apple-mobile-web-app-capable')
Test "RemixIcon CDN 4.6.0"     ($b2 -match 'remixicon@4\.6\.0')
Test "NO core.js"               ($b2 -notmatch 'core\.js')
Test "NO GSAP reference"        ($b2 -notmatch 'gsap')
Test "Space Grotesk font"       ($b2 -match 'Space\+Grotesk')
Test "Space Mono font"          ($b2 -match 'Space\+Mono')
Test "CSS :root tokens"         ($b2 -match ':root\s*\{')
Test "Primary color #f45f00"    ($b2 -match '#f45f00')
Test "100dvh layout"            ($b2 -match '100dvh')
Test "Intro overlay"            ($b2 -match 'id="intro"')
Test "INICIAR button"           ($b2 -match 'INICIAR')
Test "App container"            ($b2 -match 'id="app"')
Test "BPM hero display"         ($b2 -match 'bpm-hero')
Test "BPM value element"        ($b2 -match 'id="bpmVal"')
Test "BPM confidence"           ($b2 -match 'id="bpmConf"')
Test "Beat ring"                ($b2 -match 'id="beatRing"')
Test "Visualizer"               ($b2 -match 'id="viz"')
Test "Candidates"               ($b2 -match 'id="candidates"')
Test "Source panel"              ($b2 -match 'src-panel')
Test "3 source buttons"         (([regex]::Matches($b2, 'class="src-btn"')).Count -eq 3)
Test "ri-mic-line icon"         ($b2 -match 'ri-mic-line')
Test "ri-file-music-line"       ($b2 -match 'ri-file-music-line')
Test "ri-broadcast-line"        ($b2 -match 'ri-broadcast-line')
Test "ri-pulse-line icon"       ($b2 -match 'ri-pulse-line')
Test "ri-stop-line in JS"       ($b2 -match 'ri-stop-line')
Test "Action button"            ($b2 -match 'id="actionBtn"')
Test "Stream URL input"         ($b2 -match 'id="streamUrl"')
Test "File input accept=audio"  ($b2 -match 'accept="audio/\*"')
Test "Stats grid (3 cols)"      ($b2 -match 'grid-template-columns: 1fr 1fr 1fr')
Test "History panel"            ($b2 -match 'history-panel')
Test "History clear btn"        ($b2 -match 'id="historyClear"')
Test "Toast error"              ($b2 -match 'id="toast"')
Test "Footer"                   ($b2 -match 'class="ftr"')

$s2pass = $pass; $s2fail = $fail
$results += "  --- $s2pass PASS / $s2fail FAIL ---"

# ═══════════════════════════════════════════════════════
#  FUNCTIONAL TEST 3: JS Engine Logic (bpm-meter.html)
# ═══════════════════════════════════════════════════════
$pass = 0; $fail = 0
$results += ""
$results += "==========================================="
$results += "  FUNCTIONAL TEST 3: JS Engine Logic"
$results += "==========================================="

Test "IIFE wrapper"               ($b2 -match "\(function\(\)\{'use strict'")
Test "AudioContext constructor"    ($b2 -match 'window\.AudioContext.*webkitAudioContext')
Test "AudioCtx on INICIAR"        ($b2 -match "startBtn.*addEventListener.*click.*audioCtx")
Test "audioCtx.resume on gesture" ($b2 -match "audioCtx\.resume\(\)")
Test "getUserMedia async"         ($b2 -match 'navigator\.mediaDevices\.getUserMedia')
Test "echoCancellation false"     ($b2 -match 'echoCancellation:\s*false')
Test "noiseSuppression false"     ($b2 -match 'noiseSuppression:\s*false')
Test "autoGainControl false"      ($b2 -match 'autoGainControl:\s*false')
Test "Resume AFTER getUserMedia"  ($b2 -match "getUserMedia[\s\S]*audioCtx\.state.*suspended.*audioCtx\.resume")
Test "createAnalyser"             ($b2 -match 'createAnalyser')
Test "fftSize 2048"               ($b2 -match 'fftSize\s*=\s*2048')
Test "lowpass filter 200Hz"       ($b2 -match "lowpass\.frequency\.value\s*=\s*200")
Test "createMediaStreamSource"    ($b2 -match 'createMediaStreamSource')
Test "createMediaElementSource"   ($b2 -match 'createMediaElementSource')
Test "Pre-alloc Float32Array"     ($b2 -match 'new Float32Array\(bufLen\)')
Test "Pre-alloc Uint8Array"       ($b2 -match 'new Uint8Array\(bufLen\)')
Test "lowpass state var"          ($b2 -match 'var lowpass\s*=\s*null')
Test "timeData state var"         ($b2 -match 'var timeData\s*=\s*null')
Test "freqData state var"         ($b2 -match 'var freqData\s*=\s*null')
Test "requestAnimationFrame"      ($b2 -match 'requestAnimationFrame\(tick\)')
Test "cancelAnimationFrame"       ($b2 -match 'cancelAnimationFrame\(rafId\)')
Test "Peak threshold 0.35"        ($b2 -match 'PEAK_THRESHOLD\s*=\s*0\.35')
Test "BPM range 60-220"           ($b2 -match 'MIN_BPM.*60' -and $b2 -match 'MAX_BPM.*220')
Test "Median filter outliers"     ($b2 -match 'median.*0\.4')
Test "Stability check"            ($b2 -match 'function checkStability')
Test "BPM candidates"             ($b2 -match 'function updateCandidates')
Test "History recording"          ($b2 -match 'function addHistory')
Test "Toast messages"             ($b2 -match 'function toast')
Test "Stop cleanup lowpass"       ($b2 -match "lowpass.*disconnect.*lowpass\s*=\s*null")
Test "Stop cleanup stream"        ($b2 -match 'mediaStream.*getTracks.*stop')
Test "Stop cleanup source"        ($b2 -match 'sourceNode.*disconnect.*sourceNode\s*=\s*null')
Test "Err: NotAllowedError"       ($b2 -match 'NotAllowedError')
Test "Err: NotFoundError"         ($b2 -match 'NotFoundError')
Test "Err: NotReadableError"      ($b2 -match 'NotReadableError')
Test "Err: AbortError"            ($b2 -match 'AbortError')
Test "Cleanup on error: stream"   ($b2 -match 'stream\.getTracks.*forEach')
Test "Cleanup on error: element"  ($b2 -match 'element.*pause.*element\.src')

$s3pass = $pass; $s3fail = $fail
$results += "  --- $s3pass PASS / $s3fail FAIL ---"

# ═══════════════════════════════════════════════════════
#  FUNCTIONAL TEST 4: Mobile & AudioContext Recovery
# ═══════════════════════════════════════════════════════
$pass = 0; $fail = 0
$results += ""
$results += "==========================================="
$results += "  FUNCTIONAL TEST 4: Mobile + Recovery"
$results += "==========================================="

Test "visibilitychange listener"  ($b2 -match "visibilitychange")
Test "audioCtx.state interrupted" ($b2 -match "interrupted")
Test "Resume on foreground"       ($b2 -match "document\.hidden[\s\S]*audioCtx\.resume")
Test "beforeunload cleanup"       ($b2 -match "beforeunload")
Test "playsInline attribute"      ($b2 -match 'playsInline\s*=\s*true')
Test "crossOrigin anonymous"      ($b2 -match "crossOrigin.*anonymous")
Test "Audio element loop"         ($b2 -match 'element\.loop\s*=\s*true')
Test "tap-highlight color"        ($b2 -match 'tap-highlight-color')
Test "overscroll-behavior"        ($b2 -match 'overscroll-behavior:\s*none')
Test "Responsive 480px"           ($b2 -match 'min-width:\s*480px')
Test "Responsive 768px"           ($b2 -match 'min-width:\s*768px')

$s4pass = $pass; $s4fail = $fail
$results += "  --- $s4pass PASS / $s4fail FAIL ---"

# ═══════════════════════════════════════════════════════
#  FUNCTIONAL TEST 5: CDN Dependencies Reachable
# ═══════════════════════════════════════════════════════
$pass = 0; $fail = 0
$results += ""
$results += "==========================================="
$results += "  FUNCTIONAL TEST 5: CDN Dependencies"
$results += "==========================================="

try {
    $cdn1 = Invoke-WebRequest "https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.min.css" -UseBasicParsing -TimeoutSec 10
    Test "RemixIcon CSS reachable" ($cdn1.StatusCode -eq 200)
    Test "RemixIcon CSS has content" ($cdn1.RawContentLength -gt 1000)
} catch { Test "RemixIcon CSS reachable" $false; Test "RemixIcon CSS has content" $false }

try {
    $cdn2 = Invoke-WebRequest "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" -UseBasicParsing -TimeoutSec 10
    Test "Google Fonts reachable" ($cdn2.StatusCode -eq 200)
} catch { Test "Google Fonts reachable" $false }

$s5pass = $pass; $s5fail = $fail
$results += "  --- $s5pass PASS / $s5fail FAIL ---"

# ═══════════════════════════════════════════════════════
#  FUNCTIONAL TEST 6: Security Layer Files
# ═══════════════════════════════════════════════════════
$pass = 0; $fail = 0
$results += ""
$results += "==========================================="
$results += "  FUNCTIONAL TEST 6: Security Layer Files"
$results += "==========================================="

# sw.js
$sw = (Invoke-WebRequest "$base/sw.js" -UseBasicParsing -TimeoutSec 10).Content
Test "sw.js loads (200)"            ($sw.Length -gt 100)
Test "sw.js cache name"             ($sw -match 'CACHE_NAME')
Test "sw.js install event"          ($sw -match "self\.addEventListener\('install'")
Test "sw.js activate event"         ($sw -match "self\.addEventListener\('activate'")
Test "sw.js fetch event"            ($sw -match "self\.addEventListener\('fetch'")
Test "sw.js origin check"           ($sw -match 'url\.origin.*location\.origin')
Test "sw.js wasm/blob protection"   ($sw -match '\.wasm.*\.blob')
Test "sw.js message handler"        ($sw -match "self\.addEventListener\('message'")
Test "sw.js error handler"          ($sw -match "self\.addEventListener\('error'")

# bpm-core.blob.js
$blob = (Invoke-WebRequest "$base/bpm-core.blob.js" -UseBasicParsing -TimeoutSec 10).Content
Test "blob.js loads (200)"          ($blob.Length -gt 100)
Test "blob.js has encrypt fn"       ($blob -match 'function encrypt')
Test "blob.js has decrypt fn"       ($blob -match 'function decrypt')
Test "blob.js has XOR logic"        ($blob -match 'charCodeAt')
Test "blob.js has ENCRYPTED_CORE"   ($blob -match 'ENCRYPTED_CORE')
Test "blob.js has BPM_CORE_MODULE"  ($blob -match 'BPM_CORE_MODULE')

# bpm-core.wasm.js
$wasm = (Invoke-WebRequest "$base/bpm-core.wasm.js" -UseBasicParsing -TimeoutSec 10).Content
Test "wasm.js loads (200)"          ($wasm.Length -gt 100)
Test "wasm.js WebAssembly.Memory"   ($wasm -match 'WebAssembly\.Memory')
Test "wasm.js exports startMic"     ($wasm -match 'startMic')
Test "wasm.js exports stopAnalysis" ($wasm -match 'stopAnalysis')
Test "wasm.js exports getBPM"       ($wasm -match 'getBPM')
Test "wasm.js exports version"      ($wasm -match 'version')
Test "wasm.js global export"        ($wasm -match 'window\.ApolloBPMWasm')

# bpm-assets.blob.js
$assets = (Invoke-WebRequest "$base/bpm-assets.blob.js" -UseBasicParsing -TimeoutSec 10).Content
Test "assets.js loads (200)"        ($assets.Length -gt 100)
Test "assets.js has encryptAsset"   ($assets -match 'function encryptAsset')
Test "assets.js has decryptAsset"   ($assets -match 'function decryptAsset')
Test "assets.js has ENCRYPTED_CSS"  ($assets -match 'ENCRYPTED_CSS')
Test "assets.js has loadCSS fn"     ($assets -match 'loadCSS')
Test "assets.js has loadTemplate"   ($assets -match 'loadTemplate')
Test "assets.js global export"      ($assets -match 'window\.BPM_ASSETS')

# bpm-manifest.json
$mf = (Invoke-WebRequest "$base/bpm-manifest.json" -UseBasicParsing -TimeoutSec 10).Content
$mj = $mf | ConvertFrom-Json
Test "manifest.json loads"          ($mf.Length -gt 50)
Test "manifest name"                ($mj.name -eq "Apollo BPM MAX")
Test "manifest short_name"          ($mj.short_name -eq "BPM MAX")
Test "manifest start_url"           ($mj.start_url -eq "./index.html")
Test "manifest display standalone"  ($mj.display -eq "standalone")
Test "manifest theme_color"         ($mj.theme_color -eq "#f45f00")
Test "manifest orientation"         ($mj.orientation -eq "portrait")
Test "manifest lang pt-BR"          ($mj.lang -eq "pt-BR")
Test "manifest icons present"       ($mj.icons.Count -ge 1)

$s6pass = $pass; $s6fail = $fail
$results += "  --- $s6pass PASS / $s6fail FAIL ---"

# ═══════════════════════════════════════════════════════
#  FUNCTIONAL TEST 7: Cross-File Navigation Flow
# ═══════════════════════════════════════════════════════
$pass = 0; $fail = 0
$results += ""
$results += "==========================================="
$results += "  FUNCTIONAL TEST 7: Navigation Flow"
$results += "==========================================="

# index.html references
Test "index->bpm-meter redirect" ($b1 -match "window\.location\.href\s*=\s*'\./bpm-meter\.html'")
Test "index->sw.js register"     ($b1 -match "register\('\./sw\.js'")
Test "index->manifest link"      ($b1 -match 'href="\./bpm-manifest\.json"')

# sw.js references
Test "sw->index.html cache"      ($sw -match '\./index\.html')
Test "sw->manifest cache"        ($sw -match '\./bpm-manifest\.json')

# bpm-meter.html is self-contained
Test "bpm-meter self-contained"  (-not ($b2 -match 'bpm-core\.blob') -and -not ($b2 -match 'bpm-core\.wasm') -and -not ($b2 -match 'bpm-assets\.blob'))
Test "bpm-meter no SW register"  (-not ($b2 -match 'serviceWorker\.register'))

$s7pass = $pass; $s7fail = $fail
$results += "  --- $s7pass PASS / $s7fail FAIL ---"

# ═══════════════════════════════════════════════════════
#  FUNCTIONAL TEST 8: Known Issues Check
# ═══════════════════════════════════════════════════════
$pass = 0; $fail = 0
$results += ""
$results += "==========================================="
$results += "  FUNCTIONAL TEST 8: Known Issues"
$results += "==========================================="

# SW caches wrong file extensions (.wasm vs .wasm.js, .blob vs .blob.js)
Test "SW caches .wasm (not .wasm.js)" ($sw -match '\./bpm-core\.wasm[^.]')
Test "SW caches .blob (not .blob.js)" ($sw -match '\./bpm-assets\.blob[^.]')

# Check if SW blocks files that bpm-meter.html doesn't use
Test "bpm-meter uses no .wasm/.blob"  (-not ($b2 -match '\.wasm|\.blob'))

# Check correct async function in bpm-meter
Test "startAnalysis is async"         ($b2 -match 'async function startAnalysis')

# Check no console.error left in production
$consoleErrors = ([regex]::Matches($b2, 'console\.error')).Count
Test "No console.error in bpm-meter"  ($consoleErrors -eq 0)

# Check file references consistency
$indexFiles = @('bpm-meter.html','sw.js','bpm-manifest.json')
foreach($f in $indexFiles) {
    $exists = try { (Invoke-WebRequest "$base/$f" -UseBasicParsing -TimeoutSec 5).StatusCode -eq 200 } catch { $false }
    Test "File exists: $f" $exists
}

$s8pass = $pass; $s8fail = $fail
$results += "  --- $s8pass PASS / $s8fail FAIL ---"

# ═══════════════════════════════════════════════════════
#  SUMMARY
# ═══════════════════════════════════════════════════════
$totalPass = $s1pass + $s2pass + $s3pass + $s4pass + $s5pass + $s6pass + $s7pass + $s8pass
$totalFail = $s1fail + $s2fail + $s3fail + $s4fail + $s5fail + $s6fail + $s7fail + $s8fail
$results += ""
$results += "==========================================="
$results += "  FINAL SUMMARY"
$results += "  TOTAL: $totalPass PASS / $totalFail FAIL"
$results += "  OVERALL: $(if($totalFail -eq 0){'ALL PASS'}else{'HAS FAILURES'})"
$results += "==========================================="

# Write results to file
$outFile = Join-Path $PSScriptRoot "_smoke_results.txt"
$results | Out-File -FilePath $outFile -Encoding utf8
Write-Host "Results written to $outFile"
Write-Host ""
$results | ForEach-Object { Write-Host $_ }
