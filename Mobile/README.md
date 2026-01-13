# ClientX

ClientX is a comprehensive Client Management System built with Flutter. It facilitates interaction between administrators and clients, allowing for efficient management of projects, tasks, and analytics.

# ClientX (Mobile)

Mobile client for ClientX built with Flutter.

See the global overview for architecture and run order: [../GLOBAL_README.md](../GLOBAL_README.md)

Features (high level): Admin dashboard, client views, project/task management, analytics, and notifications.

Quick start:

```bash
# ensure Flutter is installed: https://docs.flutter.dev/get-started/install
flutter pub get
flutter run
```

Project structure highlights:

- `lib/screens/admin` — Admin screens (Dashboard, Analytics, Clients, Projects, Notifications).
- `lib/screens/client` — Client screens (Home, Tasks, Projects).
- `lib/widgets` — Reusable UI components.

Dependencies include `google_fonts` and `font_awesome_flutter`; see `pubspec.yaml` for the full list.
