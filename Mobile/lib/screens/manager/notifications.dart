import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';

class ManagerNotificationScreen extends StatefulWidget {
  const ManagerNotificationScreen({super.key});

  @override
  State<ManagerNotificationScreen> createState() =>
      _ManagerNotificationScreenState();
}

class _ManagerNotificationScreenState extends State<ManagerNotificationScreen> {
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    final notifications = await ApiService.getManagerNotifications();
    if (mounted) {
      setState(() {
        _notifications = notifications;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          'Notifications',
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: const Color(0xFF182C4C),
        elevation: 0,
        centerTitle: true,
      ),
      body: _notifications.isEmpty
          ? Center(
              child: Text(
                'No notifications',
                style: GoogleFonts.poppins(color: Colors.grey),
              ),
            )
          : RefreshIndicator(
              onRefresh: _loadNotifications,
              child: ListView.separated(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16.0),
                itemCount: _notifications.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  return _buildNotificationTile(_notifications[index]);
                },
              ),
            ),
    );
  }

  Widget _buildNotificationTile(Map<String, dynamic> notification) {
    final bool isRead = notification['is_read'] ?? false;
    final String type = notification['notif_type'] ?? 'system';
    final String createdAt = notification['created_at'] != null
        ? notification['created_at'].toString().split('T')[0]
        : 'Just now';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: _getIconColor(type).withOpacity(0.1),
          child: Icon(_getIcon(type), color: _getIconColor(type)),
        ),
        title: Text(
          notification['title'] ?? 'Notification',
          style: GoogleFonts.poppins(
            fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              notification['message'] ?? '',
              style: GoogleFonts.poppins(color: Colors.grey[600], fontSize: 13),
            ),
            const SizedBox(height: 6),
            Text(
              createdAt,
              style: GoogleFonts.poppins(color: Colors.grey[400], fontSize: 11),
            ),
          ],
        ),
        onTap: () {
          // Handle tap
        },
      ),
    );
  }

  IconData _getIcon(String type) {
    if (type.contains('task')) return Icons.check_circle;
    if (type.contains('project')) return Icons.work;
    return Icons.notifications;
  }

  Color _getIconColor(String type) {
    if (type.contains('task')) return Colors.blue;
    if (type.contains('project')) return Colors.green;
    return Colors.grey;
  }
}
