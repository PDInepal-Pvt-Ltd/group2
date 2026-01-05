import 'package:clientx/screens/employee/profile.dart';
import 'package:flutter/material.dart';
import 'package:clientx/screens/employee/homepage.dart';
import 'package:clientx/screens/employee/analytics.dart';
import 'package:clientx/screens/employee/my_tasks.dart';

class ClientBottomnav extends StatefulWidget {
  const ClientBottomnav({super.key});

  @override
  State<ClientBottomnav> createState() => _ClientBottomnavState();
}

class _ClientBottomnavState extends State<ClientBottomnav> {
  int _currentIndex = 0;
  final List<Widget> _pages = [
    Center(child: ClientHomepage()),
    Center(child: AnalyticsScreen()),
    Center(child: MyTasksScreen()),
    Center(child: Profile()),
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
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(Icons.analytics),
            label: 'Analytics',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.task_alt), label: 'Tasks'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
      // Floating Action Button removed as Employees cannot create tasks/projects
      // floatingActionButton: FloatingActionButton(...)
    );
  }
}
