import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../services/api_service.dart';
import '../../models/user_model.dart';

import 'add_user.dart';

class AdminClients extends StatefulWidget {
  const AdminClients({super.key});

  @override
  State<AdminClients> createState() => _AdminClientsState();
}

class _AdminClientsState extends State<AdminClients> {
  List<User> _users = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  Future<void> _loadUsers() async {
    final users = await ApiService.getAllUsers();
    if (mounted) {
      setState(() {
        _users = users;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Group users by role
    final admins = _users.where((u) => u.role == 'admin').toList();
    final managers = _users.where((u) => u.role == 'manager').toList();
    final employees = _users
        .where((u) => u.role == 'employee' || u.role == 'client')
        .toList();
    final others = _users
        .where(
          (u) =>
              u.role != 'admin' &&
              u.role != 'manager' &&
              u.role != 'employee' &&
              u.role != 'client',
        )
        .toList();

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(
          'Employees',
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFF182C4C),
        elevation: 0,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(30)),
        ),
        toolbarHeight: 80,
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: Colors.white),
            onPressed: () async {
              final result = await Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AddUserScreen()),
              );
              if (result == true) {
                _loadUsers();
              }
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildRoleGroup(
                  'Admins',
                  admins,
                  Icons.admin_panel_settings,
                  Colors.red,
                ),
                const SizedBox(height: 12),
                _buildRoleGroup(
                  'Managers',
                  managers,
                  Icons.supervisor_account,
                  Colors.orange,
                ),
                const SizedBox(height: 12),
                _buildRoleGroup(
                  'Employees',
                  employees,
                  Icons.people,
                  Colors.blue,
                ),
                if (others.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  _buildRoleGroup(
                    'Unassigned Roles',
                    others,
                    Icons.help_outline,
                    Colors.grey,
                  ),
                ],
              ],
            ),
    );
  }

  Widget _buildRoleGroup(
    String title,
    List<User> users,
    IconData icon,
    Color color,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ExpansionTile(
        initiallyExpanded: true,
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: color),
        ),
        title: Text(
          title,
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w600,
            color: const Color(0xFF182C4C),
          ),
        ),
        subtitle: Text(
          '${users.length} Users',
          style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600]),
        ),
        children: users.isEmpty
            ? [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    'No $title found.',
                    style: GoogleFonts.poppins(color: Colors.grey),
                  ),
                ),
              ]
            : users.map((user) => _buildUserTile(user)).toList(),
      ),
    );
  }

  Widget _buildUserTile(User user) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      leading: CircleAvatar(
        radius: 16,
        backgroundColor: const Color(0xFF182C4C).withOpacity(0.1),
        child: Text(
          (user.username?.isNotEmpty ?? false)
              ? user.username![0].toUpperCase()
              : 'U',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF182C4C),
            fontSize: 12,
          ),
        ),
      ),
      title: Text(
        user.username ?? 'Unknown',
        style: GoogleFonts.poppins(
          fontWeight: FontWeight.w500,
          fontSize: 14,
          color: const Color(0xFF182C4C),
        ),
      ),
      subtitle: Text(
        user.email ?? 'No Email',
        style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 12),
      ),
      trailing: user.isActive != null
          ? Icon(
              Icons.circle,
              size: 10,
              color: (user.isActive ?? false) ? Colors.green : Colors.red,
            )
          : null,
    );
  }
}
