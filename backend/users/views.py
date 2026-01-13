from django.contrib.auth import get_user_model, logout
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsAdminOrManager
from .serializers import (
    UserSerializer,
    PasswordResetSerializer,
    SetNewPasswordSerializer
)
from .permissions import IsAdminOrManager

User = get_user_model()

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)

class RegisterView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrManager]

    def post(self, request):
        data = request.data.copy()  

        if request.user.role == 'manager' and not request.user.is_superuser:
            data['role'] = 'employee'

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "User created successfully", "user": serializer.data},
            status=status.HTTP_201_CREATED
        )

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()

        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            reset_link = f"http://127.0.0.1:3000/reset-password?uid={uid}&token={token}"

            send_mail(
                "Password Reset",
                f"Reset your password: {reset_link}",
                None,
                [email],
            )
        return Response({"message": "If email exists, reset link sent"})


class PasswordResetConfirmAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = urlsafe_base64_decode(serializer.validated_data['uid']).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"error": "Invalid UID"}, status=400)

        if not default_token_generator.check_token(user, serializer.validated_data['token']):
            return Response({"error": "Invalid or expired token"}, status=400)

        user.set_password(serializer.validated_data['password'])
        user.save()

        return Response({"message": "Password reset successful"})
