class User {
  final int? id;
  final String? username;
  final String? email;
  final String? firstName;
  final String? lastName;
  final String? role;
  final String? phone;
  final String? company;
  final String? department;
  final String? address;
  final String? notes;
  final String? tags;
  final bool? isActive;

  User({
    this.id,
    this.username,
    this.email,
    this.firstName,
    this.lastName,
    this.role,
    this.phone,
    this.company,
    this.department,
    this.address,
    this.notes,
    this.tags,
    this.isActive,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      role: json['role'],
      phone: json['phone'],
      company: json['company'],
      department: json['department'],
      address: json['address'],
      notes: json['notes'],
      tags: json['tags'],
      isActive: json['is_active'] ?? true, // Default to true if not provided
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
      'role': role,
      'phone': phone,
      'company': company,
      'department': department,
      'address': address,
      'notes': notes,
      'tags': tags,
      'is_active': isActive,
    };
  }
}
