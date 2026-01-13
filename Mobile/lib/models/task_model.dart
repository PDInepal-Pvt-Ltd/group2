class Task {
  final int id;
  final String title;
  final String? description;
  final String status;
  final String? dueDate;
  final List<String> assignedTo;
  final String? groupName;

  Task({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    this.dueDate,
    required this.assignedTo,
    this.groupName,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'],
      status: json['status'] ?? 'todo',
      dueDate: json['due_date'],
      assignedTo:
          (json['assigned_to'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      groupName: json['group'] != null ? json['group'].toString() : null,
    );
  }
}
