import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../services/api_service.dart';

import 'admin_notifications.dart';

class AdminAnalytics extends StatefulWidget {
  const AdminAnalytics({super.key});

  @override
  State<AdminAnalytics> createState() => _AdminAnalyticsState();
}

class _AdminAnalyticsState extends State<AdminAnalytics> {
  Map<String, dynamic> _analytics = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAnalytics();
  }

  Future<void> _loadAnalytics() async {
    final data = await ApiService.getAdminAnalytics();
    if (mounted) {
      setState(() {
        _analytics = data;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_analytics.isEmpty) {
      return Center(
        child: Text(
          'No analytics data available',
          style: GoogleFonts.poppins(color: Colors.grey),
        ),
      );
    }

    final roleData = _analytics['user_role_analytics'] ?? {};
    final taskData = _analytics['task_analytics'] ?? {};

    return Scaffold(
      backgroundColor: Colors.grey[50], // Match app theme
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Custom Header
            Container(
              padding: const EdgeInsets.fromLTRB(16, 60, 16, 30),
              decoration: const BoxDecoration(
                color: Color(0xFF182C4C),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Center(
                        child: Text(
                          'Analytics',
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Positioned(
                        right: 0,
                        child: IconButton(
                          icon: const Icon(
                            Icons.notifications,
                            color: Colors.white,
                          ),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const AdminNotifications(),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 30),
                  _buildOverviewCards(roleData, taskData),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'User Roles Distribution',
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF182C4C),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildPieChart(roleData),

                  const SizedBox(height: 24),
                  Text(
                    'Task Status Distribution',
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF182C4C),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildTaskBarChart(taskData),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOverviewCards(
    Map<String, dynamic> roleData,
    Map<String, dynamic> taskData,
  ) {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 2.2, // Compact ratio
      children: [
        _buildAnalyticCard(
          title: 'Total Employees',
          value: '${roleData['total_employees'] ?? 0}',
          icon: Icons.people,
          color: Colors.blue,
        ),
        _buildAnalyticCard(
          title: 'Total Tasks',
          value: '${taskData['total_tasks'] ?? 0}',
          icon: Icons.task,
          color: Colors.purple,
        ),
        _buildAnalyticCard(
          title: 'Overdue Tasks',
          value: '${taskData['overdue_tasks_count'] ?? 0}',
          icon: Icons.warning_amber_rounded,
          color: Colors.red,
        ),
        // Placeholder for fourth card to balance grid if needed, or spread full width?
        // For now, let's just add Total Projects if available or leave 3.
        // Employee analytics had 4 cards. Admin analytics has 3 main stats.
        // I'll add 'Total Admins' or similar to make it even.
        _buildAnalyticCard(
          title: 'Total Managers',
          value: '${roleData['total_managers'] ?? 0}',
          icon: Icons.manage_accounts,
          color: Colors.orange,
        ),
      ],
    );
  }

  Widget _buildPieChart(Map<String, dynamic> data) {
    final admins = (data['total_admins'] ?? 0).toDouble();
    final managers = (data['total_managers'] ?? 0).toDouble();
    final employees = (data['total_employees'] ?? 0).toDouble();
    final total = admins + managers + employees;

    if (total == 0) return const SizedBox.shrink();

    return Container(
      height: 300,
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        children: [
          Expanded(
            child: PieChart(
              PieChartData(
                sectionsSpace: 2,
                centerSpaceRadius: 40,
                sections: [
                  PieChartSectionData(
                    value: admins,
                    title: 'Admins',
                    color: Colors.redAccent,
                    radius: 50,
                    titleStyle: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  PieChartSectionData(
                    value: managers,
                    title: 'Managers',
                    color: Colors.orangeAccent,
                    radius: 50,
                    titleStyle: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  PieChartSectionData(
                    value: employees,
                    title: 'Employees',
                    color: Colors.blueAccent,
                    radius: 50,
                    titleStyle: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildLegendItem('Admin', Colors.redAccent),
              _buildLegendItem('Manager', Colors.orangeAccent),
              _buildLegendItem('Employee', Colors.blueAccent),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTaskBarChart(Map<String, dynamic> data) {
    final List<dynamic> statusList = data['tasks_by_status'] ?? [];
    if (statusList.isEmpty) return const SizedBox.shrink();

    return Container(
      height: 300,
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: BarChart(
        BarChartData(
          alignment: BarChartAlignment.spaceAround,
          maxY:
              statusList.fold<double>(0, (max, item) {
                double count = (item['count'] ?? 0).toDouble();
                return count > max ? count : max;
              }) +
              2,
          barTouchData: BarTouchData(enabled: true),
          titlesData: FlTitlesData(
            show: true,
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (value, meta) {
                  int index = value.toInt();
                  if (index >= 0 && index < statusList.length) {
                    return Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        statusList[index]['status']?.toString().toUpperCase() ??
                            '',
                        style: GoogleFonts.poppins(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    );
                  }
                  return const Text('');
                },
              ),
            ),
            leftTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: true, reservedSize: 30),
            ),
            topTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
            rightTitles: const AxisTitles(
              sideTitles: SideTitles(showTitles: false),
            ),
          ),
          gridData: const FlGridData(show: false),
          borderData: FlBorderData(show: false),
          barGroups: statusList.asMap().entries.map((entry) {
            int index = entry.key;
            double count = (entry.value['count'] ?? 0).toDouble();
            return BarChartGroupData(
              x: index,
              barRods: [
                BarChartRodData(
                  toY: count,
                  color: _getStatusColor(entry.value['status']),
                  width: 25,
                  borderRadius: BorderRadius.circular(4),
                ),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'todo':
        return Colors.grey;
      case 'in_progress':
        return Colors.blue;
      case 'review':
        return Colors.orange;
      case 'completed':
        return Colors.green;
      default:
        return Colors.blue;
    }
  }

  Widget _buildLegendItem(String label, Color color) {
    return Row(
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 4),
        Text(label, style: GoogleFonts.poppins(fontSize: 12)),
      ],
    );
  }

  BoxDecoration _cardDecoration() {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }

  Widget _buildAnalyticCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  value,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    fontSize: 11,
                    color: Colors.grey[600],
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
