import 'package:clientx/screens/manager/analytics.dart';
import 'package:clientx/screens/manager/manager_homepage.dart';
import 'package:clientx/screens/manager/notifications.dart';
import 'package:clientx/screens/employee/profile.dart'; // Unified Profile
import 'package:clientx/screens/manager/manager_projects.dart';
import 'package:flutter/material.dart';

class ManagerBottomnav extends StatefulWidget {
  const ManagerBottomnav({super.key});

  @override
  State<ManagerBottomnav> createState() => _ManagerBottomnavState();
}

class _ManagerBottomnavState extends State<ManagerBottomnav> {
  int _currentIndex = 0;
  final List<Widget> _pages = [
    const Center(child: ManagerHomepage()),
    const Center(child: ManagerAnalyticsScreen()),
    const Center(child: ManagerProjects()),
    const Center(child: ManagerNotificationScreen()),
    const Center(child: Profile()), // Using standard Profile widget
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFF182C4C),
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(Icons.analytics),
            label: 'Analytics',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.work), label: 'Projects'),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: 'Notifications',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
