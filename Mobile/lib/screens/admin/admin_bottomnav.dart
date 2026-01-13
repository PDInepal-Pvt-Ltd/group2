import 'package:clientx/screens/admin/admin_clients.dart';
import 'package:clientx/screens/admin/admin_homepage.dart';
import 'package:clientx/screens/admin/admin_projects.dart';
import 'package:clientx/screens/admin/admin_analytics.dart';
import 'package:clientx/screens/employee/profile.dart';
import 'package:flutter/material.dart';

class AdminBottomNav extends StatefulWidget {
  const AdminBottomNav({super.key});

  @override
  State<AdminBottomNav> createState() => _AdminBottomNavState();
}

class _AdminBottomNavState extends State<AdminBottomNav> {
  int _currentIndex = 0;
  final List<Widget> _pages = [
    const AdminHomePage(),
    const AdminAnalytics(),
    const AdminProjects(),
    const AdminClients(),
    const Profile(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: false,
      body: Container(color: Colors.grey[50], child: _pages[_currentIndex]),
      bottomNavigationBar: BottomNavigationBar(
        elevation: 8,
        backgroundColor: const Color(0xFF182C4C),
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.grey,
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(Icons.analytics),
            label: 'Analytics',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment),
            label: 'Projects',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Employees'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
