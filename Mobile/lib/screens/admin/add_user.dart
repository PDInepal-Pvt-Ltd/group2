import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';

class AddUserScreen extends StatefulWidget {
  const AddUserScreen({super.key});

  @override
  State<AddUserScreen> createState() => _AddUserScreenState();
}

class _AddUserScreenState extends State<AddUserScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _departmentController = TextEditingController();
  String _role = 'employee';
  bool _isLoading = false;

  void _submitData() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      final userData = {
        'username': _usernameController.text,
        'email': _emailController.text,
        'password': _passwordController.text,
        'role': _role,
        'first_name': _firstNameController.text,
        'last_name': _lastNameController.text,
        'department': _departmentController.text,
      };

      final result = await ApiService.adminCreateUser(userData);

      if (mounted) {
        setState(() => _isLoading = false);
        if (result['success']) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('User created successfully!')),
          );
          Navigator.pop(
            context,
            true,
          ); // Return true to indicate refresh needed
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(result['message'] ?? 'Failed to create user'),
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: const Color(0xFF182C4C),
        title: Text(
          'Add New User',
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSectionTitle('Account Details'),
                    const SizedBox(height: 16),
                    _buildTextField(
                      _usernameController,
                      'Username',
                      Icons.person,
                      (val) => val == null || val.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 12),
                    _buildTextField(
                      _emailController,
                      'Email',
                      Icons.email,
                      (val) => val == null || val.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 12),
                    _buildTextField(
                      _passwordController,
                      'Password',
                      Icons.lock,
                      (val) => val == null || val.length < 6
                          ? 'Min 6 characters'
                          : null,
                      obscure: true,
                    ),
                    const SizedBox(height: 24),

                    _buildSectionTitle('Role & Department'),
                    const SizedBox(height: 16),
                    _buildDropdown(),
                    const SizedBox(height: 12),
                    _buildTextField(
                      _departmentController,
                      'Department',
                      Icons.business,
                      null,
                    ),
                    const SizedBox(height: 24),

                    _buildSectionTitle('Personal Info'),
                    const SizedBox(height: 16),
                    _buildTextField(
                      _firstNameController,
                      'First Name',
                      Icons.badge,
                      null,
                    ),
                    const SizedBox(height: 12),
                    _buildTextField(
                      _lastNameController,
                      'Last Name',
                      Icons.badge,
                      null,
                    ),
                    const SizedBox(height: 40),

                    SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        onPressed: _submitData,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF182C4C),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Create User',
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.poppins(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: const Color(0xFF182C4C),
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label,
    IconData icon,
    String? Function(String?)? validator, {
    bool obscure = false,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: const Color(0xFF182C4C)),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildDropdown() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _role,
          isExpanded: true,
          items: ['admin', 'manager', 'employee'].map((role) {
            return DropdownMenuItem(
              value: role,
              child: Text(role.toUpperCase(), style: GoogleFonts.poppins()),
            );
          }).toList(),
          onChanged: (val) {
            if (val != null) setState(() => _role = val);
          },
        ),
      ),
    );
  }
}
