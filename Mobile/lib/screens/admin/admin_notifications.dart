import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';

class AdminNotifications extends StatefulWidget {
  const AdminNotifications({super.key});

  @override
  State<AdminNotifications> createState() => _AdminNotificationsState();
}

class _AdminNotificationsState extends State<AdminNotifications> {
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    final notifications = await ApiService.getAdminNotifications();
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
        backgroundColor: const Color(0xFF182C4C),
        title: Text(
          'Notifications',
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
        elevation: 0,
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
                itemCount: _notifications.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final notification = _notifications[index];
                  final type = notification['notif_type'] ?? 'system';
                  final createdAt = notification['created_at'] != null
                      ? notification['created_at'].toString().split('T')[0]
                      : 'Just now';

                  return Container(
                    color: Colors.white,
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      leading: CircleAvatar(
                        backgroundColor: _getIconColor(type).withOpacity(0.1),
                        child: Icon(_getIcon(type), color: _getIconColor(type)),
                      ),
                      title: Text(
                        notification['title'] ?? 'Notification',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: const Color(0xFF182C4C),
                        ),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Text(
                            notification['message'] ?? '',
                            style: GoogleFonts.poppins(
                              color: Colors.grey[800],
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            createdAt,
                            style: GoogleFonts.poppins(
                              color: Colors.grey[500],
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                      isThreeLine: true,
                      onTap: () {
                        // Handle tap
                      },
                    ),
                  );
                },
              ),
            ),
    );
  }

  IconData _getIcon(String type) {
    if (type.contains('task')) return Icons.check_circle;
    if (type.contains('project')) return Icons.work;
    if (type.contains('client')) return Icons.person_add;
    return Icons.notifications;
  }

  Color _getIconColor(String type) {
    if (type.contains('task')) return Colors.blue;
    if (type.contains('project')) return Colors.green;
    if (type.contains('admin')) return Colors.orange;
    return Colors.grey;
  }
}
