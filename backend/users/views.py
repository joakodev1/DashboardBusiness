import csv
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from .models import Client, UserProfile
from .serializers import ClientSerializer

# Regla de seguridad: Máximo 3 subidas de foto por minuto por usuario
class AvatarUploadThrottle(UserRateThrottle):
    rate = '3/minute'

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by('-created_at')
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

# Endpoint exclusivo para atrapar la imagen desde React
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([AvatarUploadThrottle]) # Aplicamos el candado
def upload_avatar(request):
    user = request.user
    
    # Busca el perfil del admin logueado (o lo crea si es la primera vez que sube foto)
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    # Verifica que el archivo viaje en la petición bajo el nombre 'avatar'
    if 'avatar' in request.FILES:
        profile.avatar = request.FILES['avatar']
        profile.save()
        
        # Devuelve la URL absoluta (ej: http://localhost:8000/media/avatars/foto.jpg)
        return Response({
            'message': 'Foto actualizada correctamente', 
            'avatar_url': request.build_absolute_uri(profile.avatar.url)
        })
    
    return Response({'error': 'No se recibió ninguna imagen en la petición'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_clients_csv(request):
    # Configuramos la respuesta HTTP para que el navegador sepa que es un archivo descargable
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="clientes.csv"'
    
    writer = csv.writer(response)
    
    # 1. Escribimos la cabecera (los nombres de las columnas)
    writer.writerow(['Nombre', 'Email', 'Telefono', 'Fecha de Registro'])
    
    # 2. Traemos todos los clientes de la base de datos
    clients = Client.objects.all().order_by('-created_at')
    
    # 3. Recorremos la base y escribimos fila por fila
    for client in clients:
        writer.writerow([
            client.name, 
            client.email if client.email else 'Sin email', 
            client.phone if client.phone else 'Sin teléfono', 
            client.created_at.strftime("%d/%m/%Y %H:%M") # Formateamos la fecha (Ej: 06/09/2026)
        ])
        
    return response