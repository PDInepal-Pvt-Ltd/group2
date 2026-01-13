import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../models/task_model.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8000/api';

  // Authentication Helpers
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  static Future<void> saveTokens(String access, String? refresh) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', access);
    if (refresh != null) {
      await prefs.setString('refresh_token', refresh);
    }
  }

  static Future<void> clearTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    await prefs.remove('user_role');
  }

  static Future<void> logout() async {
    await clearTokens();
  }

  static Future<void> saveRole(String role) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_role', role);
  }

  static Future<String?> getRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_role');
  }

  // Authentication
  static Future<Map<String, dynamic>> login(
    String username,
    String password,
  ) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/users/login/'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'username': username, 'password': password}),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        await saveTokens(data['access'], data['refresh']);

        // Fetch profile to get role
        final user = await getProfile();
        if (user != null) {
          await saveRole(user.role ?? 'employee');
        }

        return {'success': true, 'data': data};
      }
      return {
        'success': false,
        'message': 'Login failed: ${response.statusCode}',
      };
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  static Future<Map<String, dynamic>> register(
    Map<String, dynamic> userData,
  ) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/users/register/'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(userData),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 201 || response.statusCode == 200) {
        return {'success': true, 'data': jsonDecode(response.body)};
      }
      return {
        'success': false,
        'message': 'Registration failed: ${response.body}',
      };
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // User Profile
  static Future<User?> getProfile() async {
    try {
      final token = await getToken();
      if (token == null) return null;

      final response = await http
          .get(
            Uri.parse('$baseUrl/users/profile/'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Profile fetch error: $e');
      return null;
    }
  }

  static Future<bool> updateProfile(Map<String, dynamic> profileData) async {
    try {
      final token = await getToken();
      final response = await http
          .patch(
            Uri.parse('$baseUrl/users/profile/'),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
            body: jsonEncode(profileData),
          )
          .timeout(const Duration(seconds: 10));

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  // Admin Dashboard & Management
  static Future<Map<String, dynamic>> getAdminDashboardStats() async {
    try {
      final token = await getToken();
      final response = await http
          .get(
            Uri.parse('$baseUrl/admin-dashboard/'),
            headers: {'Authorization': 'Bearer $token'},
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return {'total_employees': 0, 'total_projects': 0, 'total_tasks': 0};
    } catch (e) {
      return {'total_employees': 0, 'total_projects': 0, 'total_tasks': 0};
    }
  }

  static Future<List<User>> getAllUsers() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/admin-dashboard/users/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.map((json) => User.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Projects
  static Future<List<Map<String, dynamic>>> getProjects() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/tasks/groups/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.cast<Map<String, dynamic>>();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<Map<String, dynamic>> createProject(
    Map<String, dynamic> projectData,
  ) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('$baseUrl/tasks/groups/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(projectData),
      );
      if (response.statusCode == 201) {
        return {'success': true, 'data': jsonDecode(response.body)};
      }
      return {'success': false, 'message': response.body};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  static Future<Map<String, dynamic>> updateProject(
    int groupId,
    Map<String, dynamic> projectData,
  ) async {
    try {
      final token = await getToken();
      final response = await http.patch(
        Uri.parse('$baseUrl/tasks/groups/$groupId/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(projectData),
      );
      if (response.statusCode == 200) {
        return {'success': true, 'data': jsonDecode(response.body)};
      }
      return {'success': false, 'message': response.body};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // Tasks
  static Future<List<Task>> getAllTasks() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/admin-dashboard/tasks/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.map((json) => Task.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<List<Task>> getMyTasks({int? groupId}) async {
    try {
      final token = await getToken();
      String url = '$baseUrl/tasks/my-tasks/';
      if (groupId != null) {
        url += '?group_id=$groupId';
      }
      final response = await http.get(
        Uri.parse(url),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.map((json) => Task.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<Map<String, dynamic>> createTask(
    Map<String, dynamic> taskData,
  ) async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('$baseUrl/tasks/create/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(taskData),
      );
      if (response.statusCode == 201) {
        return {'success': true, 'data': jsonDecode(response.body)};
      }
      return {'success': false, 'message': response.body};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  static Future<Map<String, dynamic>> updateTask(
    int taskId,
    Map<String, dynamic> taskData,
  ) async {
    try {
      final token = await getToken();
      final response = await http.patch(
        Uri.parse('$baseUrl/tasks/$taskId/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(taskData),
      );
      if (response.statusCode == 200) {
        return {'success': true, 'task': jsonDecode(response.body)};
      }
      return {
        'success': false,
        'message': jsonDecode(response.body).toString(),
      };
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // Analytics
  static Future<Map<String, dynamic>> getAdminAnalytics() async {
    try {
      final token = await getToken();
      final response = await http
          .get(
            Uri.parse('$baseUrl/admin-dashboard/analytics/'),
            headers: {'Authorization': 'Bearer $token'},
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return {};
    } catch (e) {
      return {};
    }
  }

  // Notifications
  static Future<List<Map<String, dynamic>>> getAdminNotifications() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/notifications/admin/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.cast<Map<String, dynamic>>();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getManagerNotifications() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/notifications/manager/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.cast<Map<String, dynamic>>();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  static Future<List<Map<String, dynamic>>> getEmployeeNotifications() async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/notifications/employee/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.cast<Map<String, dynamic>>();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Admin Legacy/Compatibility
  static Future<Map<String, dynamic>> adminCreateUser(
    Map<String, dynamic> userData,
  ) async {
    return register(userData);
  }
}
