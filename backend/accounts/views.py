from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.models import User, StudentProfile, CompanyProfile
from accounts.serializers import (UserSerializer, StudentProfileSerializer,
                       CompanyProfileSerializer, RegisterStudentSerializer,
                       RegisterCompanySerializer, LoginSerializer)
from accounts.authentication import generate_token, send_email


class SignupView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_type = request.data.get('user_type', 'student')

        if user_type == 'student':
            serializer = RegisterStudentSerializer(data=request.data)
        else:
            serializer = RegisterCompanySerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(email=email, password=password, role=user_type)

            if user_type == 'student':
                StudentProfile.objects.create(
                    user=user,
                    first_name=serializer.validated_data['first_name'],
                    last_name=serializer.validated_data['last_name']
                )
            else:
                CompanyProfile.objects.create(
                    user=user,
                    company_name=serializer.validated_data['company_name'],
                    company_role=serializer.validated_data.get('company_role', 'HR'),
                    company_size=serializer.validated_data.get('company_size', '1-10'),
                    industry=serializer.validated_data.get('industry', 'tech')
                )

            token = generate_token(user)
            
            return Response({
                'message': 'Account created successfully',
                'token': token,
                'user': {'id': str(user.id), 'email': email, 'role': user_type}
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            if not user.check_password(password):
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

            if not user.is_active:
                return Response({'error': 'Account is disabled'}, status=status.HTTP_401_UNAUTHORIZED)

            token = generate_token(user)

            return Response({
                'token': token,
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'role': user.role,
                    'is_verified': user.is_verified
                }
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'student':
            try:
                profile = user.student_profile
                return Response({
                    "email": user.email,
                    "first_name": profile.first_name,
                    "last_name": profile.last_name,
                    "role": "student",
                    "resume_score": profile.resume_score,
                    "profile_completion": profile.profile_completion,
                    "skills": profile.skills,
                })
            except:
                return Response({
                    "email": user.email,
                    "first_name": "",
                    "last_name": "",
                    "role": "student",
                    "resume_score": 0,
                    "profile_completion": 0,
                    "skills": [],
                })
        elif user.role == 'company':
            try:
                profile = user.company_profile
                return Response({
                    "email": user.email,
                    "company_name": profile.company_name,
                    "company_role": profile.company_role,
                    "company_size": profile.company_size,
                    "role": "company",
                })
            except:
                return Response({
                    "email": user.email,
                    "company_name": "",
                    "company_role": "HR",
                    "company_size": "1-10",
                    "role": "company",
                })
        return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user
        if user.role == 'student':
            profile = user.student_profile
            serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
        elif user.role == 'company':
            profile = user.company_profile
            serializer = CompanyProfileSerializer(profile, data=request.data, partial=True)
        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({'message': 'Logged out successfully'})