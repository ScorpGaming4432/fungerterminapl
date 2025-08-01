def compat_check(original_game_dir=str, translated_game_dir=str):
  """
  Check if the original and translated game directories are compatible.
  """
  from pathlib import Path
  import os
  import json
  import re

  if not original_game_dir or not translated_game_dir:
    raise ValueError("Both original and translated game directories must be provided.")
  
  log("Checking if dirs are not the same", "debug", end="...")
  if original_game_dir == translated_game_dir:
    raise ValueError("Original and translated game directories cannot be the same.")
  log("PASSED", "debug")

  '''
  # Clean and Convert to Path objects
  log("Converting input paths to Path objects", "debug")
  original_game_dir = Path(original_game_dir)
  translated_game_dir = Path(translated_game_dir)
  log(f"{original_game_dir=}", "debug")
  log(f"{translated_game_dir=}", "debug")
  '''

  # Check if directories exist
  log("Checking if directories exist", "debug", end="...")
  if not original_game_dir.exists():
    raise FileNotFoundError(f"Original game directory does not exist: {original_game_dir}")
  if not translated_game_dir.exists():
    raise FileNotFoundError(f"Translated game directory does not exist: {translated_game_dir}")
  log("PASSED", "debug")

  # TODO Check if it's even goood to check the www
  # Check for 'www' subdirectories
  log("Checking for 'www' directories", "verbose")
  if not (original_game_dir / "www").exists() or not (translated_game_dir / "www").exists():
    raise FileNotFoundError("Both directories must contain a 'www' subdirectory.")
  www_orig = original_game_dir / "www"
  www_trans = translated_game_dir / "www"
  log(f"'www' found in both directories", "debug")

  # Check required subdirectories inside 'www'
  for subdir in ["data", "movies", "fonts", "js"]:
    orig_subdir = www_orig / subdir
    trans_subdir = www_trans / subdir
    log(f"Checking subdirectory: {subdir}", "verbose")

    if not orig_subdir.exists():
      raise FileNotFoundError(f"Missing directory in original game: {orig_subdir}")
    if not trans_subdir.exists():
      raise FileNotFoundError(f"Missing directory in translated game: {trans_subdir}")

    for root, dirs, files in os.walk(orig_subdir):
      rel_root = Path(root).relative_to(www_orig)
      translated_root = www_trans / rel_root
      if not translated_root.exists():
        raise FileNotFoundError(f"Missing directory in translated game: {translated_root}")
      
      for file in files:
        orig_file = Path(root) / file
        trans_file = translated_root / file
        if not trans_file.exists():
          raise FileNotFoundError(f"Missing file in translated game: {trans_file}")
        log(f"File present: {file}", "debug")

  # Check contents of 'data' files
  for root, dirs, files in os.walk(str(www_orig / "data")):
    if dirs != []:
      raise FileExistsError("There should be no subdirectories in the 'data' directory.")
    log(f"Checking {len(files)} files in 'data'...", "verbose")

    for file in files:
      if file in [".DS_Store", "Animations.json", "System.json", "Tilesets.json"]:
        log(f"Skipping non-critical file: {file}", "debug")
        continue

      full_orig = www_orig / "data" / file
      full_trans = www_trans / "data" / file

      if file in [
        "Actors.json", "Armors.json", "Classes.json", "CommonEvents.json",
        "Enemies.json", "Items.json", "MapInfos.json", "Skills.json",
        "States.json", "Troops.json", "Weapons.json"
      ]:
        log(f"Checking structured system file: {file}", "verbose")
        with open(full_orig, encoding="utf-8", newline="\n") as f1, \
           open(full_trans, encoding="utf-8", newline="\n") as f2:
          ids1 = [entry['id'] for entry in json.load(f1) if entry is not None and 'id' in entry]
          ids2 = [entry['id'] for entry in json.load(f2) if entry is not None and 'id' in entry]
        log(f"{file}: {len(ids1)} IDs vs {len(ids2)} IDs", "debug")
        if len(ids1) != len(ids2):
          raise ValueError(f"ID count mismatch: {file} has {len(ids1)} IDs in original, {len(ids2)} in translated.")
      
      elif re.compile(r"Map\d+\.json").match(file):
        log(f"Checking map file: {file}", "verbose")
        with open(full_orig, encoding="utf-8", newline="\n") as f1, \
           open(full_trans, encoding="utf-8", newline="\n") as f2:
          map_data1 = json.load(f1)
          map_data2 = json.load(f2)
        ogmapid = [entry['id'] for entry in map_data1["events"] if entry is not None and 'id' in entry]
        trmapid = [entry['id'] for entry in map_data2["events"] if entry is not None and 'id' in entry]
        log(f"{file} map events: {len(ogmapid)} vs {len(trmapid)}", "debug")
        if len(ogmapid) != len(trmapid):
          raise ValueError(f"Map event ID mismatch in {file}: {ogmapid=} NEQ {trmapid=}")
      else:
        raise FileExistsError(f"Unexpected file in 'data' directory: {file}.")

  log("Compatibility check passed.", "info")

def create_patch(original_game_dir=str, translated_game_dir=str):
  """
  Create a custom translation .patch files for RPG Maker MV games.
  """
  patch_dir = translated_game_dir / "PATCH"
  patch_dir.mkdir(parents=True, exist_ok=True)
  pass

if __name__ == "__main__":
  import argparse
  parser = argparse.ArgumentParser(description="Creates a custom translation patch file for RPG Maker MV games. To be used with patch_apply.py.")
  parser.add_argument("original", help="Path to original game directory")
  parser.add_argument("translated", help="Path to translated game directory")
  parser.add_argument("-d", "--debug",  action="store_true", help="Enable debug output")
  parser.add_argument("-v", "--verbose", action="store_true", help="Enable more verbose output")
  parser.add_argument("-s", "--silent", action="store_true", help="Show only critical errors and suppress most output")
  args = parser.parse_args()
  
  if args.silent and (args.debug or args.verbose):
    raise ValueError("--silent overrides --debug and --verbose.")

  if args.silent:
    print("Silent mode enabled, only critical errors will be shown.")
  elif args.debug:
    print("Debug mode ON")
  elif args.verbose:
    print("Verbose mode ON")
    
  # Logging wrapper
  def log(msg, level="info", end="\n"):
    if args.silent:
      return
    if level == "debug" and args.debug:
      print(f"[DEBUG] {msg}", end=end)
    elif level == "verbose" and (args.verbose or args.debug):
      print(f"[VERBOSE] {msg}", end=end)
    elif level == "info":
      print(msg, end=end)

  from pathlib import Path
  try:
    original_path = Path(args.original).resolve()
    translated_path = Path(args.translated).resolve()
    log("Running compatibility check...", "verbose")
    compat_check(original_path, translated_path)
    create_patch(original_path, translated_path)

  except Exception as e:
    print("Error:", e)
    if args.debug:
      import traceback
      traceback.print_exc()
    input("Press Enter to exit with error...")

  input("Press Enter to exit...")