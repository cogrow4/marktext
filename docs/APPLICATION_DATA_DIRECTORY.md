# Application Data Directory

The per-user application data directory is located in the following directory:

- `%APPDATA%\novelcraft` on Windows
- `$XDG_CONFIG_HOME/novelcraft` or `~/.config/novelcraft` on Linux
- `~/Library/Application Support/novelcraft` on macOS

When [portable mode](PORTABLE.md) is enabled, the directory location is either the `--user-data-dir` parameter or `novelcraft-user-data` directory.
