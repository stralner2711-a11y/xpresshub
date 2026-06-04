#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
IOS_DIR="$ROOT_DIR/ios/App"
WORKSPACE="$IOS_DIR/App.xcworkspace"
SCHEME="App"

echo "XpressIntra Apple/iOS build helper"
echo "Project: $ROOT_DIR"
echo

if [ "$(uname -s)" != "Darwin" ]; then
  echo "This script must be run on a Mac with Xcode."
  echo "Windows can sync the iOS files, but Apple build/TestFlight upload requires macOS."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js/npm is missing. Install Node.js first."
  exit 1
fi

if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "Xcode command line tools are missing. Install Xcode, then run:"
  echo "sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  exit 1
fi

cd "$ROOT_DIR"

echo "[1/5] Installing project packages..."
npm install

echo
echo "[2/5] Building web app and syncing iOS..."
npm run ios:sync

echo
echo "[3/5] Installing iOS pods if CocoaPods is available..."
if command -v pod >/dev/null 2>&1; then
  cd "$IOS_DIR"
  pod install
  cd "$ROOT_DIR"
else
  echo "CocoaPods was not found. If Xcode cannot build, install it with:"
  echo "sudo gem install cocoapods"
fi

echo
echo "[4/5] Checking iOS simulator build without signing..."
xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Debug \
  -sdk iphonesimulator \
  CODE_SIGNING_ALLOWED=NO \
  build

echo
echo "[5/5] Opening Xcode workspace..."
open "$WORKSPACE"

echo
echo "iOS project is ready in Xcode."
echo "For TestFlight/App Store: choose your Apple Developer Team, test on iPhone, then Product -> Archive."

