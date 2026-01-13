from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .services import global_search

class GlobalSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        keyword = request.query_params.get('q', '').strip()
        result = global_search(keyword, request.user)

        return Response({
            "keyword": keyword,
            "employees": [
                {
                    "id": e.id,
                    "username": e.username,
                    "department": e.department
                } for e in result["employees"]
            ],
            "tasks": [
                {
                    "id": t.id,
                    "title": t.title,
                    "status": t.status
                } for t in result["tasks"]
            ]
        })
