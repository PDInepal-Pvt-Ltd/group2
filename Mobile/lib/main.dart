import 'package:clientx/screens/admin/admin_bottomnav.dart';
import 'package:clientx/screens/employee/bottomnav.dart';
import 'package:clientx/screens/login_page.dart';
import 'package:clientx/screens/manager/manager_bottomnav.dart';
import 'package:clientx/screens/register_page.dart';
import 'package:clientx/services/api_service.dart';
import 'package:flutter/material.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final token = await ApiService.getToken();
  final role = await ApiService.getRole();
  runApp(MyApp(role: role, isAuthenticated: token != null));
}

class MyApp extends StatelessWidget {
  final bool isAuthenticated;
  final String? role;
  const MyApp({super.key, required this.isAuthenticated, this.role});

  @override
  Widget build(BuildContext context) {
    String initialRoute = '/login';
    if (isAuthenticated) {
      if (role == 'admin') {
        initialRoute = '/adminBottomNav';
      } else if (role == 'manager') {
        initialRoute = '/managerBottomNav';
      } else {
        initialRoute = '/clientBottomNav';
      }
    }

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: initialRoute,
      routes: {
        '/adminBottomNav': (context) => const AdminBottomNav(),
        '/admin-home': (context) =>
            const AdminBottomNav(), // Alias for login logic
        '/clientBottomNav': (context) => const ClientBottomnav(),
        '/client-home': (context) =>
            const ClientBottomnav(), // Alias for login navigation
        '/managerBottomNav': (context) => const ManagerBottomnav(),
        '/manager-home': (context) =>
            const ManagerBottomnav(), // Alias for login logic
        '/login': (context) => const LoginPage(),
        '/register': (context) => const RegisterPage(),
      },
    );
  }
}
