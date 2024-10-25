
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import TonnageStudy
from .serializers import TonnageStudySerializer

@api_view(['POST'])
def save_data(request):
    serializer = TonnageStudySerializer(data=request.data)
    if serializer.is_valid():
        session_name = serializer.validated_data['session_name']
        data = serializer.validated_data['data']
        TonnageStudy.objects.create(session_name=session_name, data=data)
        return Response({'status': 'success'})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_session_data(request, session_name):
    try:
        session_data = TonnageStudy.objects.get(session_name=session_name)
        serializer = TonnageStudySerializer(session_data)
        return Response(serializer.data)
    except TonnageStudy.DoesNotExist:
        return Response({'error': 'Session not found'}, status=404)
